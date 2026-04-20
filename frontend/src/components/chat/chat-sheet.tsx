"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "./chat-window"
import { chatApi } from "@/lib/api/chat-api"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/useAuth"

interface ChatSheetProps {
    itemId: string
    publisherId: string
    itemTitle: string
    publisherName: string
}

export function ChatSheet({ itemId, publisherId, itemTitle, publisherName }: ChatSheetProps) {
    const [open, setOpen] = React.useState(false)
    const { user, isAuthenticated } = useAuth()
    
    // Only enable socket connection when sheet is open
    const { sendMessage, isConnected } = useChat(open && isAuthenticated)

    const { data: convData, isLoading } = useQuery({
        queryKey: ["chat-messages", itemId, publisherId],
        queryFn: () => chatApi.getMessages(itemId, publisherId),
        enabled: open && isAuthenticated,
    })

    const messages = convData?.success ? convData.data?.details?.messages || [] : []

    const handleSend = async (content: string) => {
        return await sendMessage(itemId, publisherId, content)
    }

    if (!isAuthenticated) return null;

    // Don't show chat if the current user is the publisher
    if (user?.id === publisherId) return null;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
                >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with Owner
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-[400px]">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Inquiry about</span>
                        <span className="truncate">{itemTitle}</span>
                    </SheetTitle>
                    <div className="flex items-center gap-2 mt-2">
                         <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
                         <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Connecting..."}</span>
                    </div>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleSend}
                        otherUserName={publisherName}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
