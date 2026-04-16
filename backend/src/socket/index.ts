import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { envConfig } from "../envConfig.ts";
import pool from "../db/postgres.ts";
import logger from "../config/logger.ts";
import type { SafeUser, JwtPayload, UserRow } from "../types/auth.types.ts";
import { SendMessageSchema } from "../schemas/chat.schemas.ts";
import type { ChatMessage } from "../types/chat.types.ts";
import { sendNewMessageEmail } from "../services/email.service.ts";

const COOKIE_NAME = "access_token";

// In-memory map to track online users: userId -> Map<socketId, Socket>
const onlineUsers = new Map<string, Map<string, Socket>>();

export const initSocketServer = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: envConfig.FRONTEND_URL,
            credentials: true,
        },
    });

    // ─── Socket.io Middleware for JWT Auth ──────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            if (!cookieHeader) return next(new Error("Authentication error: No cookies found"));

            const cookies = Object.fromEntries(
                cookieHeader.split("; ").map((c) => {
                    const [key, ...v] = c.split("=");
                    return [key, v.join("=")];
                })
            );

            const token = cookies[COOKIE_NAME];
            if (!token) return next(new Error("Authentication error: Token missing"));

            const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
            
            const { rows } = await pool.query<UserRow>(
                "SELECT * FROM users WHERE id = $1 AND is_active = true LIMIT 1",
                [decoded.sub]
            );

            const user = rows[0];
            if (!user) return next(new Error("Authentication error: User not found or inactive"));

            const { password_hash: _, ...safeUser } = user;
            socket.data.user = safeUser;
            next();
        } catch (err) {
            logger.error(`Socket auth error: ${err}`);
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const user: SafeUser = socket.data.user;
        const userId = user.id;

        logger.info(`User connected: ${user.email} (${socket.id})`);

        // Track user online status
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Map());
        }
        onlineUsers.get(userId)!.set(socket.id, socket);

        // ─── Events ──────────────────────────────────────────────────────────
        
        socket.on("send_message", async (payload: any, callback?: Function) => {
            try {
                const parsed = SendMessageSchema.safeParse(payload);
                if (!parsed.success) {
                    return callback?.({ success: false, error: "Validation failed", details: parsed.error.flatten() });
                }

                const { item_id, receiver_id, content } = parsed.data;
                const sender_id = userId;

                if (sender_id === receiver_id) {
                    return callback?.({ success: false, error: "You cannot message yourself" });
                }

                // 1. Determine publisher_id and inquirer_id
                const { rows: itemRows } = await pool.query<{ user_id: string, title: string }>(
                    "SELECT user_id, title FROM rental_items WHERE id = $1 LIMIT 1",
                    [item_id]
                );

                const item = itemRows[0];
                if (!item) return callback?.({ success: false, error: "Item not found" });

                const publisher_id = item.user_id;
                let inquirer_id: string;

                if (sender_id === publisher_id) {
                    inquirer_id = receiver_id;
                } else {
                    inquirer_id = sender_id;
                }

                // Verify the receiver is actually part of this conversation (either the publisher or the specific inquirer)
                // In a basic system, any user can inquire, so if sender != publisher, then sender is inquirer.
                // If sender == publisher, receiver must be the person who inquired.
                
                const newMessage: ChatMessage = {
                    sender_id,
                    content,
                    sent_at: new Date().toISOString(),
                };

                // 2. Upsert conversation and append message
                // Using jsonb_insert or just pulling and pushing in code (simpler for basic app)
                // We'll use COALESCE and || operator in SQL for atomic update
                const { rows: convRows } = await pool.query(
                    `INSERT INTO conversations (publisher_id, item_id, inquirer_id, messages)
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (publisher_id, item_id, inquirer_id)
                     DO UPDATE SET 
                        messages = conversations.messages || $4,
                        updated_at = CURRENT_TIMESTAMP
                     RETURNING *`,
                    [publisher_id, item_id, inquirer_id, JSON.stringify([newMessage])]
                );

                // 3. Emit to receiver if online
                const receiverSockets = onlineUsers.get(receiver_id);
                if (receiverSockets && receiverSockets.size > 0) {
                    receiverSockets.forEach((s) => {
                        s.emit("new_message", {
                            item_id,
                            sender_id,
                            message: newMessage
                        });
                    });
                } else {
                    // 4. Send email if receiver is offline
                    const { rows: receiverRows } = await pool.query<{ email: string }>(
                        "SELECT email FROM users WHERE id = $1 LIMIT 1",
                        [receiver_id]
                    );
                    if (receiverRows[0]) {
                        await sendNewMessageEmail(
                            receiverRows[0].email,
                            user.name,
                            item.title,
                            content.length > 100 ? content.substring(0, 97) + "..." : content
                        );
                    }
                }

                callback?.({ success: true, data: newMessage });
            } catch (err) {
                logger.error(`Socket sendMessage error: ${err}`);
                callback?.({ success: false, error: "Internal server error" });
            }
        });

        socket.on("disconnect", () => {
            logger.info(`User disconnected: ${user.email} (${socket.id})`);
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }
        });
    });

    return io;
};
