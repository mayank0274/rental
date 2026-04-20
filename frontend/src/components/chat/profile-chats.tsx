"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { User, MessageCircle } from "lucide-react"

import { chatApi, Conversation } from "@/lib/api/chat-api"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/useAuth"
import { ChatWindow } from "./chat-window"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ConversationList } from "./conversation-list"

export function ProfileChats() {
    const { user, isAuthenticated } = useAuth()
    const [selectedConv, setSelectedConv] = React.useState<Conversation | null>(null)
    
    // Enable chat globally in this tab
    const { sendMessage, isConnected } = useChat(isAuthenticated)

    const { data: convesationsData, isLoading: isListLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => chatApi.getConversations(),
        enabled: isAuthenticated,
    })

    const conversations = convesationsData?.success ? convesationsData.data?.details || [] : []

    const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
        queryKey: ["chat-messages", selectedConv?.item_id, selectedConv?.publisher_id === user?.id ? selectedConv?.inquirer_id : selectedConv?.publisher_id],
        queryFn: () => chatApi.getMessages(selectedConv!.item_id, selectedConv!.publisher_id === user?.id ? selectedConv!.inquirer_id : selectedConv!.publisher_id),
        enabled: !!selectedConv && !!user,
    })

    const messages = messagesData?.success ? messagesData.data?.details?.messages || [] : []

    const handleSend = async (content: string) => {
        if (!selectedConv || !user) return { success: false }
        const otherUserId = selectedConv.publisher_id === user.id ? selectedConv.inquirer_id : selectedConv.publisher_id
        return await sendMessage(selectedConv.item_id, otherUserId, content)
    }

    if (!isAuthenticated) return null

    return (
        <div className="flex h-[600px] gap-6 rounded-lg border bg-card shadow-sm overflow-hidden mt-6">
            {/* Conversation List Sidebar */}
            <ConversationList
                className="w-full sm:w-[320px] border-r"
                conversations={conversations}
                isLoading={isListLoading}
                selectedConv={selectedConv}
                onSelect={setSelectedConv}
            />

            {/* Chat Window Container */}
            <div className="flex-1 hidden sm:flex flex-col bg-background">
                 {selectedConv ? (
                    <>
                        <div className="p-4 border-b flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-sm">{selectedConv.other_user_name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">{selectedConv.item_title}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ChatWindow
                                messages={messages}
                                isLoading={isMessagesLoading}
                                onSendMessage={handleSend}
                                otherUserName={selectedConv.other_user_name}
                            />
                        </div>
                    </>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                         <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
                            <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                         </div>
                         <div>
                            <h3 className="font-medium">Select a conversation</h3>
                            <p className="text-xs text-muted-foreground max-w-[240px] mt-1">
                                Pick a chat from the list on the left to view the message history and reply.
                            </p>
                         </div>
                    </div>
                 )}
            </div>
        </div>
    )
}
