import express from "express";
import { User } from "../models/User.js";
import { getCookieName, getCookieOptions, signToken } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ userId: user._id });
    res.cookie(getCookieName(), token, getCookieOptions());
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user._id });
    res.cookie(getCookieName(), token, getCookieOptions());
    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: "Unable to login" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(getCookieName());
  return res.json({ message: "Logged out" });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

export default router;