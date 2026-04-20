"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatMessage } from "@/lib/api/chat-api";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useChat = (enabled: boolean = false) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!enabled) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        if (socketRef.current) return;

        const s = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket"], // Force websocket for reliability
        });

        socketRef.current = s;
        setSocket(s);

        s.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected");
        });

        s.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket disconnected");
        });

        s.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            toast.error("Failed to connect to chat server");
        });

        s.on("new_message", (data: { item_id: string; sender_id: string; message: ChatMessage }) => {
            // Update the specific conversation cache if it's currently open
            queryClient.invalidateQueries({ queryKey: ["chat-messages", data.item_id, data.sender_id] });
            // Update the conversation list
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            
            toast.info("New message received");
        });

        return () => {
            s.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        };
    }, [enabled, queryClient]);

    const sendMessage = useCallback(
        (itemId: string, receiverId: string, content: string) => {
            return new Promise<{ success: boolean; data?: ChatMessage; error?: string }>((resolve) => {
                if (!socketRef.current || !isConnected) {
                    resolve({ success: false, error: "Not connected to chat server" });
                    return;
                }

                socketRef.current.emit(
                    "send_message",
                    { item_id: itemId, receiver_id: receiverId, content },
                    (res: any) => {
                        if (res.success) {
                            // On success, refresh messages for this conversation
                            queryClient.invalidateQueries({ queryKey: ["chat-messages", itemId, receiverId] });
                            queryClient.invalidateQueries({ queryKey: ["conversations"] });
                        }
                        resolve(res);
                    }
                );
            });
        },
        [isConnected, queryClient]
    );

    return {
        socket,
        isConnected,
        sendMessage,
    };
};
