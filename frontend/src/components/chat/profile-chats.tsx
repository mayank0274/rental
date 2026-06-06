"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { MessageCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

import { chatApi, Conversation } from "@/lib/api/chat-api"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/useAuth"
import { ChatWindow } from "./chat-window"
import { ConversationList } from "./conversation-list"
import { Button } from "@/components/ui/button"

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
        <div className="flex h-[600px] rounded-lg border bg-card shadow-sm overflow-hidden mt-6">
            {/* Conversation List — shown on mobile only when no conv selected; always shown on sm+ */}
            <div className={`flex flex-col border-r bg-muted/5 w-full sm:w-[320px] shrink-0 ${selectedConv ? "hidden sm:flex" : "flex"}`}>
                <ConversationList
                    conversations={conversations}
                    isLoading={isListLoading}
                    selectedConv={selectedConv}
                    onSelect={setSelectedConv}
                />
            </div>

            {/* Chat Window — shown on mobile only when a conv is selected; always shown on sm+ */}
            <div className={`flex-1 flex-col bg-background ${selectedConv ? "flex" : "hidden sm:flex"}`}>
                {selectedConv ? (
                    <>
                        <div className="p-3 border-b flex items-center gap-2">
                            {/* Back button — mobile only */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden h-8 w-8 shrink-0"
                                onClick={() => setSelectedConv(null)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm truncate">{selectedConv.other_user_name}</h3>
                                <Link
                                    href={`/rental/${selectedConv.item_slug}`}
                                    title={selectedConv.item_title}
                                    className="text-[10px] text-primary hover:text-primary/80 uppercase font-medium underline underline-offset-2 truncate block w-full"
                                >
                                    {selectedConv.item_title}
                                </Link>
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

