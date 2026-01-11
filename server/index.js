import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketServer } from "socket.io";

import { connectDb } from "./lib/db.js";
import { attachUserSocket, registerSocketHandlers } from "./realtime/socket.js";
import authRoutes from "./routes/auth.js";
import gigRoutes from "./routes/gigs.js";
import bidRoutes from "./routes/bids.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

io.use(attachUserSocket);
io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

const port = process.env.PORT || 4000;

connectDb().then(() => {
  server.listen(port, () => {
    console.log(`API listening on ${port}`);
  });
});