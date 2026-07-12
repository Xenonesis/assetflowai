import { getNotifications } from "@/features/notifications/actions/notification-actions";
import { NotificationList } from "./notification-list";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Notifications</h1>
        <p className="text-sm text-[var(--text-secondary)]">Stay updated with critical asset alerts and maintenance events.</p>
      </div>

      <NotificationList initialNotifications={notifications} />
    </div>
  );
}
