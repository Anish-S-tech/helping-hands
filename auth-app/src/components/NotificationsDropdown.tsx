"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Notification {
    id: string
    type: "application" | "message" | "system" | "project"
    title: string
    description: string
    timestamp: string
    read: boolean
    href?: string
    actionable?: boolean
}

// Mock notifications - will be replaced with real data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "n1",
        type: "application",
        title: "New application received",
        description: "Marcus Thorne applied for Backend Engineer position",
        timestamp: "2 hours ago",
        read: false,
        href: "/dashboard/founder",
        actionable: true
    },
    {
        id: "n2",
        type: "message",
        title: "New message from David Hoffman",
        description: "Let's discuss the timeline for the next sprint",
        timestamp: "4 hours ago",
        read: false,
        href: "/chat"
    },
    {
        id: "n3",
        type: "project",
        title: "Project milestone completed",
        description: "Nexus AI Resume Optimizer reached 80% completion",
        timestamp: "1 day ago",
        read: true,
        href: "/projects/p1"
    },
    {
        id: "n4",
        type: "system",
        title: "Profile verification pending",
        description: "Complete your profile verification to unlock all features",
        timestamp: "2 days ago",
        read: true,
        href: "/profile/edit"
    }
]

interface NotificationsDropdownProps {
    notifications?: Notification[]
}

export function NotificationsDropdown({ notifications = MOCK_NOTIFICATIONS }: NotificationsDropdownProps) {
    const [localNotifications, setLocalNotifications] = React.useState(notifications)
    const [isOpen, setIsOpen] = React.useState(false)

    const unreadCount = localNotifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setLocalNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setLocalNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        )
    }

    const removeNotification = (id: string) => {
        setLocalNotifications(prev => prev.filter(n => n.id !== id))
    }

    const getTypeColor = (type: Notification["type"]) => {
        switch (type) {
            case "application":
                return "bg-warning/10 text-warning"
            case "message":
                return "bg-blue-500/10 text-blue-500"
            case "project":
                return "bg-primary/10 text-primary"
            case "system":
                return "bg-muted/50 text-muted-foreground"
            default:
                return "bg-muted/50 text-muted-foreground"
        }
    }

    // Group notifications
    const today = localNotifications.filter(n => n.timestamp.includes("hour") || n.timestamp.includes("minute"))
    const thisWeek = localNotifications.filter(n => n.timestamp.includes("day") && !n.timestamp.includes("hour") && !n.timestamp.includes("minute"))
    const earlier = localNotifications.filter(n => !n.timestamp.includes("hour") && !n.timestamp.includes("minute") && !n.timestamp.includes("day"))

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-muted-foreground hover:text-foreground group transition-all duration-300 hover:bg-primary/5 active:scale-90 overflow-visible">
                    <Bell className="h-5 w-5 transition-transform group-hover:rotate-12 duration-200" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground text-[9px] font-extrabold flex items-center justify-center ring-2 ring-background shadow-lg shadow-primary/30 animate-in zoom-in duration-300">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <div>
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {localNotifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <>
                            {/* Today */}
                            {today.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted/30">
                                        Today
                                    </p>
                                    {today.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onRemove={removeNotification}
                                            getTypeColor={getTypeColor}
                                            setIsOpen={setIsOpen}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* This Week */}
                            {thisWeek.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted/30">
                                        This Week
                                    </p>
                                    {thisWeek.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onRemove={removeNotification}
                                            getTypeColor={getTypeColor}
                                            setIsOpen={setIsOpen}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Earlier */}
                            {earlier.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted/30">
                                        Earlier
                                    </p>
                                    {earlier.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onRemove={removeNotification}
                                            getTypeColor={getTypeColor}
                                            setIsOpen={setIsOpen}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function NotificationItem({
    notification,
    onMarkAsRead,
    onRemove,
    getTypeColor,
    setIsOpen
}: {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onRemove: (id: string) => void
    getTypeColor: (type: Notification["type"]) => string
    setIsOpen: (open: boolean) => void
}) {
    const content = (
        <div
            className={cn(
                "group relative flex gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0",
                !notification.read && "bg-primary/5"
            )}
        >
            {/* Unread Indicator */}
            {!notification.read && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
            )}

            {/* Type Icon */}
            <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                getTypeColor(notification.type)
            )}>
                <Bell className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notification.description}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {notification.timestamp}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onMarkAsRead(notification.id)
                        }}
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onRemove(notification.id)
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )

    if (notification.href) {
        return (
            <Link
                href={notification.href}
                onClick={() => {
                    onMarkAsRead(notification.id)
                    setIsOpen(false)
                }}
            >
                {content}
            </Link>
        )
    }

    return content
}
