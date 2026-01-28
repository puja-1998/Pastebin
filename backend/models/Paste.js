import mongoose from "mongoose";

/*
  Stores a single paste.
  This schema is designed to work safely in serverless environments.
*/
const PasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  // Null = no expiry
  expiresAt: {
    type: Date,
    default: null,
  },

  // Null = unlimited views
  maxViews: {
    type: Number,
    default: null,
  },

  viewCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Paste", PasteSchema);
