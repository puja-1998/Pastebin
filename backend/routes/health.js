import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/*
  GET /api/healthz
  Must return 200 + JSON and reflect DB availability
*/
router.get("/healthz", async (req, res) => {
  try {
    // Lightweight DB ping
    await mongoose.connection.db.admin().ping();

    res
      .status(200)
      .type("application/json")
      .json({ ok: true });
  } catch (err) {
    res
      .status(500)
      .type("application/json")
      .json({ ok: false });
  }
});

export default router;
