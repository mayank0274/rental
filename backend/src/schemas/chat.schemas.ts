import { z } from "zod";

export const SendMessageSchema = z.object({
    item_id: z.string().uuid("Invalid item id"),
    receiver_id: z.string().uuid("Invalid receiver id"),
    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(1000, "Message must be at most 1000 characters"),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;

export const GetConversationParamsSchema = z.object({
    item_id: z.string().uuid("Invalid item id"),
    other_user_id: z.string().uuid("Invalid user id"),
});

export type GetConversationParamsInput = z.infer<typeof GetConversationParamsSchema>;
