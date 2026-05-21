import { io } from "socket.io-client";

let socketInstance: ReturnType<typeof io> | null = null;

export const getSocket = () => {
  if (!socketInstance) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
    socketInstance = io(socketUrl, { withCredentials: true });
  }
  return socketInstance;
};
