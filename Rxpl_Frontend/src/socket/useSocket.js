import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("🚀 Initializing socket...");

    const socketInstance = io("http://localhost:8000", {
      transports: ["polling", "websocket"], // ✅ polling FIRST as fallback
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);
    console.log("🔌 Socket instance created:", socketInstance.id);

    socketInstance.on("connect", () => {
      console.log("✅ Connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.log("❌ Error:", err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
