import { useNotifications } from "../context/NotificationsContext";

export default function NotificationStack() {
  const { messages } = useNotifications();

  if (!messages.length) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 space-y-3">
      {messages.map((note) => (
        <div
          key={`${note.gigId}-${note.message}`}
          className="rounded-2xl border border-emerald-300/40 bg-emerald-950/80 px-4 py-3 text-sm text-emerald-100 shadow-xl"
        >
          {note.message}
        </div>
      ))}
    </div>
  );
}