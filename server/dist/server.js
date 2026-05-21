import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDB } from "./utils/db.js";
import { registerGameSocketHandlers } from "./socket/gameSocket.js";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
registerGameSocketHandlers(io);
const port = Number(process.env.PORT) || 8000;
connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server + Socket.IO running on port ${port}`);
    });
});
//# sourceMappingURL=server.js.map