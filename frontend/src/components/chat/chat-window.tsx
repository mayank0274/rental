"use client"

import * as React from "react"
import { Send, User as UserIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatMessage } from "@/lib/api/chat-api"
import { useAuth } from "@/hooks/useAuth"

interface ChatWindowProps {
    messages: ChatMessage[]
    isLoading: boolean
    onSendMessage: (content: string) => Promise<any>
    otherUserName?: string
}

export function ChatWindow({ messages, isLoading, onSendMessage, otherUserName }: ChatWindowProps) {
    const [input, setInput] = React.useState("")
    const [isSending, setIsSending] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    const scrollToBottom = React.useCallback(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [])

    React.useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading, scrollToBottom])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isSending) return

        setIsSending(true)
        try {
            const res = await onSendMessage(input.trim())
            if (res.success) {
                setInput("")
            }
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex h-full flex-col bg-background">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-[60%] rounded-lg" />
                            <Skeleton className="h-10 w-[40%] self-end rounded-lg" />
                            <Skeleton className="h-10 w-[70%] rounded-lg" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                            <p className="text-sm text-muted-foreground">No messages yet.</p>
                            <p className="text-xs text-muted-foreground">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.sender_id === user?.id
                            return (
                                <div
                                    key={`${msg.sent_at}-${i}`}
                                    className={`flex max-w-[80%] flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {!isMe && (
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback>
                                                    <UserIcon className="h-3 w-3" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-2xl px-4 py-2 text-sm ${isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-muted-foreground rounded-tl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                    <span className="px-1 text-[10px] text-muted-foreground/70">
                                        {format(new Date(msg.sent_at), "HH:mm")}
                                    </span>
                                </div>
                            )
                        })
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isSending}
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isSending}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
