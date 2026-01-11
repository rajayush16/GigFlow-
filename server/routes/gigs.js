import express from "express";
import { Gig } from "../models/Gig.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = {
      status: "open",
      ...(search
        ? { title: { $regex: search, $options: "i" } }
        : {}),
    };

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ gigs });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch gigs" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    return res.status(201).json({ gig });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create gig" });
  }
});

export default router;