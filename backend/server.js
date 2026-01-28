import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import db from "./config/db.js";
import Paste from "./models/Paste.js";
import pasteRoutes from "./routes/pastes.js";
import healthRoutes from "./routes/health.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//  MIDDLEWARE
app.use(express.json());
app.use(cors());

// DB CONNECTION 
db();

// ROUTES 
app.get("/", (req, res) => {
  res.send("Hello from Server");
});

// API routes
app.use("/api/pastes", pasteRoutes);
app.use("/api", healthRoutes);

/*
  GET /p/:id
  HTML paste view
  - counts view
  - enforces TTL + max_views
*/
app.get("/p/:id", async (req, res) => {
  const now = new Date();

  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
      $or: [
        { maxViews: null },
        { $expr: { $lt: ["$viewCount", "$maxViews"] } },
      ],
    },
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!paste) {
    return res.status(404).send("Not Found");
  }

  // Escape HTML
  const safeContent = paste.content
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  res.status(200).send(`
    <html>
      <body>
        <pre>${safeContent}</pre>
      </body>
    </html>
  `);
});

// FRONTEND 
app.use(express.static("client/dist"));

// SPA fallback (KEEP LAST)
app.get(/^\/(?!api).*/, (_, res) => {
  res.sendFile(path.resolve("client/dist/index.html"));
});

//  SERVER START
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
