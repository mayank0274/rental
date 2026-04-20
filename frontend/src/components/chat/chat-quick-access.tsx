"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { MessageCircle, X } from "lucide-react"

import { chatApi, Conversation } from "@/lib/api/chat-api"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/useAuth"
import { ChatWindow } from "./chat-window"
import { ConversationList } from "./conversation-list"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function ChatQuickAccess() {
    const { user, isAuthenticated } = useAuth()
    const [open, setOpen] = React.useState(false)
    const [selectedConv, setSelectedConv] = React.useState<Conversation | null>(null)
    
    // Enable chat connection when sheet is open or globally if preferred,
    // but here we follow the "lazy connection" pattern or global for navbar.
    // User requested "direct chat icon", let's use global connection when sheet is open.
    const { sendMessage, isConnected } = useChat(open && isAuthenticated)

    const { data: convsData, isLoading: isListLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => chatApi.getConversations(),
        enabled: open && isAuthenticated,
    })

    const conversations = convsData?.success ? convsData.data?.details || [] : []

    const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
        queryKey: ["chat-messages", selectedConv?.item_id, selectedConv?.publisher_id === user?.id ? selectedConv?.inquirer_id : selectedConv?.publisher_id],
        queryFn: () => chatApi.getMessages(selectedConv!.item_id, selectedConv!.publisher_id === user?.id ? selectedConv!.inquirer_id : selectedConv!.publisher_id),
        enabled: !!selectedConv && !!user && open,
    })

    const messages = messagesData?.success ? messagesData.data?.details?.messages || [] : []

    const handleSend = async (content: string) => {
        if (!selectedConv || !user) return { success: false }
        const otherUserId = selectedConv.publisher_id === user.id ? selectedConv.inquirer_id : selectedConv.publisher_id
        return await sendMessage(selectedConv.item_id, otherUserId, content)
    }

    if (!isAuthenticated) return null

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <MessageCircle className="h-[22px] w-[22px] transition-colors group-hover:text-primary" />
                    <span className="sr-only">Open Messages</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-[450px]">
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            Quick Chat
                        </SheetTitle>
                        {selectedConv && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedConv(null)}
                                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Back to list
                            </Button>
                        )}
                    </div>
                </SheetHeader>
                
                <div className="flex-1 overflow-hidden flex flex-col">
                    {selectedConv ? (
                        <>
                            <div className="px-4 py-2 border-b bg-muted/30">
                                <p className="text-xs font-medium text-muted-foreground uppercase">{selectedConv.item_title}</p>
                                <h4 className="font-semibold text-sm">{selectedConv.other_user_name}</h4>
                            </div>
                            <div className="flex-1">
                                <ChatWindow
                                    messages={messages}
                                    isLoading={isMessagesLoading}
                                    onSendMessage={handleSend}
                                    otherUserName={selectedConv.other_user_name}
                                />
                            </div>
                        </>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            isLoading={isListLoading}
                            selectedConv={selectedConv}
                            onSelect={setSelectedConv}
                            className="flex-1"
                        />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
