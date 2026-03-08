import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  movie_id: Number,

  title: String,

  poster_path: String,

  media_type: {
    type: String,
    default: "movie",
  },

  watched_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("History", historySchema);