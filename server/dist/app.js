import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
config({
    path: "./config.env",
});
export const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);
//# sourceMappingURL=app.js.map