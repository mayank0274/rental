"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { User, MessageCircle } from "lucide-react"

import { Conversation } from "@/lib/api/chat-api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ConversationListProps {
    conversations: Conversation[]
    isLoading: boolean
    selectedConv: Conversation | null
    onSelect: (conv: Conversation) => void
    className?: string
}

export function ConversationList({
    conversations,
    isLoading,
    selectedConv,
    onSelect,
    className
}: ConversationListProps) {
    return (
        <div className={`flex flex-col h-full bg-muted/5 ${className}`}>
            <div className="p-4 border-b flex items-center justify-between bg-card">
                <h3 className="font-semibold text-sm">Messages</h3>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 border-b animate-pulse flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/2 bg-muted rounded" />
                                    <div className="h-3 w-3/4 bg-muted rounded" />
                                </div>
                            </div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center gap-2">
                            <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground">No conversations found</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={`${conv.item_id}-${conv.publisher_id}-${conv.inquirer_id}`}
                                onClick={() => onSelect(conv)}
                                className={`flex items-start gap-3 p-4 border-b text-left transition-colors hover:bg-muted/50 ${
                                    selectedConv?.item_id === conv.item_id &&
                                    selectedConv?.inquirer_id === conv.inquirer_id &&
                                    selectedConv?.publisher_id === conv.publisher_id
                                        ? "bg-muted/80 shadow-inner"
                                        : ""
                                }`}
                            >
                                <Avatar className="h-9 w-9 border shadow-sm">
                                    <AvatarFallback>
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-medium text-sm truncate text-foreground">{conv.other_user_name}</p>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {conv.updated_at && formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-primary truncate font-medium">{conv.item_title}</p>
                                    <p className="text-xs text-muted-foreground truncate italic mt-0.5">
                                        {conv.last_message?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
