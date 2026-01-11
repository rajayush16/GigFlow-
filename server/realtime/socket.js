import { getCookieName, verifyToken } from "../lib/auth.js";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, item) => {
    const [key, ...value] = item.trim().split("=");
    if (!key) {
      return acc;
    }
    acc[key] = decodeURIComponent(value.join("="));
    return acc;
  }, {});
}

export function attachUserSocket(socket, next) {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies[getCookieName()];
    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    socket.join(`user:${payload.userId}`);
    return next();
  } catch (error) {
    return next();
  }
}

export function registerSocketHandlers(_io, socket) {
  socket.on("disconnect", () => {
    socket.removeAllListeners();
  });
}

export function notifyHire(io, { userId, gigTitle, gigId }) {
  io.to(`user:${userId}`).emit("gig:hired", {
    gigId,
    gigTitle,
    message: `You have been hired for ${gigTitle}!`,
  });
}