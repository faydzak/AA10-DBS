import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todosRoutes.js";
 
const app = express();
 
// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
 
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/todos", todoRoutes);
 
app.get("/health", (_req, res) => res.json({ status: "ok" }));
 
export default app;