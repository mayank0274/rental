import type { Request, Response } from "express";
import pool from "../db/postgres.ts";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.utils.ts";
import { ApiError, ApiSuccessRes } from "../utils/apiResponse.utils.ts";
import { GetConversationParamsSchema } from "../schemas/chat.schemas.ts";
import type { ConversationWithMeta } from "../types/chat.types.ts";

/**
 * Get all conversations for the current user
 */
export const getMyConversations = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const { rows } = await pool.query<ConversationWithMeta>(
            `SELECT 
                c.*,
                u.name as other_user_name,
                u.email as other_user_email,
                ri.title as item_title,
                (c.messages->>-1)::jsonb as last_message
             FROM conversations c
             JOIN rental_items ri ON c.item_id = ri.id
             JOIN users u ON (
                CASE 
                    WHEN c.publisher_id = $1 THEN u.id = c.inquirer_id
                    ELSE u.id = c.publisher_id
                END
             )
             WHERE c.publisher_id = $1 OR c.inquirer_id = $1
             ORDER BY c.updated_at DESC`,
            [user.id]
        );

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Conversations retrieved", rows));
    }
);

/**
 * Get message history for a specific conversation
 */
export const getConversationMessages = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const parsed = GetConversationParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            throw ApiError.validationError(parsed.error.flatten().fieldErrors);
        }

        const { item_id, other_user_id } = parsed.data;

        const { rows } = await pool.query(
            `SELECT * FROM conversations 
             WHERE item_id = $1 
             AND (
                (publisher_id = $2 AND inquirer_id = $3) OR
                (publisher_id = $3 AND inquirer_id = $2)
             )
             LIMIT 1`,
            [item_id, user.id, other_user_id]
        );

        const conversation = rows[0];
        if (!conversation) {
            throw ApiError.notFound("Conversation not found");
        }

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Message history retrieved", conversation));
    }
);
