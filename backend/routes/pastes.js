import express from "express";
import mongoose from "mongoose";
import Paste from "../models/Paste.js";
import { getNow } from "../utils/time.js";

const router = express.Router();

/*
  POST /api/pastes
  Creates a new paste
*/
router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  // Validation
  if (typeof content !== "string" || content.trim() === "") {
    return res
      .status(400)
      .type("application/json")
      .json({ error: "Invalid content" });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return res
      .status(400)
      .type("application/json")
      .json({ error: "Invalid ttl_seconds" });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return res
      .status(400)
      .type("application/json")
      .json({ error: "Invalid max_views" });
  }

  const now = getNow(req);

  const expiresAt =
    ttl_seconds !== undefined
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

  const paste = await Paste.create({
    content,
    createdAt: now,
    expiresAt,
    maxViews: max_views ?? null,
    viewCount: 0,
  });

  res
    .status(201)
    .type("application/json")
    .json({
      id: paste._id.toString(),
      url: `${process.env.BASE_URL}/p/${paste._id}`,
    });
});

/*
  GET /api/pastes/:id
  Fetches paste AND counts a view (atomic)
*/
router.get("/:id", async (req, res) => {
  // Validate ObjectId early
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .type("application/json")
      .json({ error: "Not found" });
  }

  const now = getNow(req);

  /*
    Atomic operation:
    - checks expiry
    - checks view limit
    - increments viewCount
  */
  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,

      // TTL condition
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],

      // View limit condition
      $or: [
        { maxViews: null },
        { $expr: { $lt: ["$viewCount", "$maxViews"] } },
      ],
    },
    {
      $inc: { viewCount: 1 },
    },
    { new: true }
  );

  // If no document matched, paste is unavailable
  if (!paste) {
    return res
      .status(404)
      .type("application/json")
      .json({ error: "Not found" });
  }

  res
    .status(200)
    .type("application/json")
    .json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null
          ? Math.max(paste.maxViews - paste.viewCount, 0)
          : null,
      expires_at: paste.expiresAt
        ? paste.expiresAt.toISOString()
        : null,
    });
});

export default router;
