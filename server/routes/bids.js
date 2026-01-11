import express from "express";
import mongoose from "mongoose";
import { Bid } from "../models/Bid.js";
import { Gig } from "../models/Gig.js";
import { requireAuth } from "../middleware/auth.js";
import { notifyHire } from "../realtime/socket.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const gig = await Gig.findById(gigId).lean();
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (String(gig.ownerId) === String(req.user._id)) {
      return res.status(403).json({ message: "Cannot bid on your own gig" });
    }

    if (gig.status !== "open") {
      return res.status(409).json({ message: "Gig is not open" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    return res.status(201).json({ bid });
  } catch (error) {
    return res.status(500).json({ message: "Unable to submit bid" });
  }
});

router.get("/:gigId", requireAuth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId).lean();
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (String(gig.ownerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ bids });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch bids" });
  }
});

router.patch("/:bidId/hire", requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Gig not found" });
    }

    if (String(gig.ownerId) !== String(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized" });
    }

    const gigUpdate = await Gig.updateOne(
      { _id: gig._id, status: "open" },
      { $set: { status: "assigned" } }
    ).session(session);

    if (gigUpdate.modifiedCount === 0) {
      await session.abortTransaction();
      return res.status(409).json({ message: "Gig already assigned" });
    }

    const bidUpdate = await Bid.updateOne(
      { _id: bid._id, status: "pending" },
      { $set: { status: "hired" } }
    ).session(session);

    if (bidUpdate.modifiedCount === 0) {
      await session.abortTransaction();
      return res.status(409).json({ message: "Bid already processed" });
    }

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { $set: { status: "rejected" } }
    ).session(session);

    await session.commitTransaction();

    const io = req.app.get("io");
    if (io) {
      notifyHire(io, {
        userId: bid.freelancerId,
        gigTitle: gig.title,
        gigId: gig._id,
      });
    }

    return res.json({ message: "Bid hired" });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Unable to hire bid" });
  } finally {
    session.endSession();
  }
});

export default router;