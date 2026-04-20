import { axiosInstance } from "../axios.ts";

export interface ChatMessage {
    sender_id: string;
    content: string;
    sent_at: string;
}

export interface Conversation {
    publisher_id: string;
    item_id: string;
    inquirer_id: string;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
    // Joined metadata
    item_title?: string;
    other_user_name?: string;
    other_user_email?: string;
    last_message?: ChatMessage | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: {
        statusCode: number;
        message: string;
        details: T;
    };
    error?: {
        statusCode: number;
        message: string;
        details?: any;
    };
}

export const chatApi = {
    getConversations: (): Promise<ApiResponse<Conversation[]>> =>
        axiosInstance.get("/api/chat/conversations"),

    getMessages: (itemId: string, otherUserId: string): Promise<ApiResponse<Conversation>> =>
        axiosInstance.get(`/api/chat/conversations/${itemId}/${otherUserId}`),
};
