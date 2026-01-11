import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const NotificationsContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export function NotificationsProvider({ children, user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("gig:hired", (payload) => {
      setMessages((prev) => [payload, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const value = useMemo(() => ({ messages }), [messages]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationsProvider");
  }
  return context;
}