import { getCookieName, verifyToken } from "../lib/auth.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[getCookieName()];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid session" });
  }
}