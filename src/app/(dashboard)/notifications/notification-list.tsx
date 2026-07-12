"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/features/notifications/actions/notification-actions";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function NotificationList({ initialNotifications = [] }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [markingAll, setMarkingAll] = useState(false);

  // Subscribe to real-time notification inserts
  useEffect(() => {
    const supabase = createClient();
    let channel: any = null;
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !isMounted) return;

      channel = supabase
        .channel(`realtime-notifications-page-${user.id}-${Math.random().toString(36).substring(7)}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            setNotifications(prev => [payload.new, ...prev]);
          }
        )
        .subscribe();
    });

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setNotifications(prev => prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      }
    } catch (e: any) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      const res = await markAllNotificationsAsRead();
      if (res.error) {
        toast.error(res.error);
      } else {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (e: any) {
      toast.error("Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="text-xs font-semibold text-[var(--primary)] hover:bg-[var(--surface-elevated)]"
          >
            {markingAll && <Loader2 className="w-3 h-3 animate-spin mr-1.5" />}
            Mark all as read
          </Button>
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border)] overflow-hidden shadow-sm">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 flex gap-4 transition-colors ${
                notif.read ? "bg-[var(--surface)]" : "bg-[var(--primary)]/[0.02]"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                notif.read 
                  ? "bg-[var(--surface-elevated)] text-[var(--text-secondary)]" 
                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
              }`}>
                <Bell className="w-4.5 h-4.5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="font-semibold text-sm text-[var(--text-primary)]">{notif.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{notif.message}</p>
                {notif.link && (
                  <Link href={notif.link} className="inline-block text-xs font-semibold text-[var(--primary)] hover:underline mt-1">
                    View Details
                  </Link>
                )}
              </div>

              {!notif.read && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="h-8 w-8 text-[var(--text-secondary)] hover:text-emerald-500 rounded-full shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-[var(--text-secondary)] flex flex-col items-center justify-center space-y-2 opacity-65">
            <BellOff className="w-10 h-10 text-[var(--text-muted)]" />
            <p>No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
