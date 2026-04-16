export interface ChatMessage {
    sender_id: string;
    content: string;
    sent_at: string;
}

export interface ConversationRow {
    publisher_id: string;
    item_id: string;
    inquirer_id: string;
    messages: ChatMessage[];
    created_at: Date;
    updated_at: Date;
}

export interface ConversationWithMeta extends ConversationRow {
    other_user_name: string;
    other_user_email: string;
    item_title: string;
    last_message: ChatMessage | null;
}
