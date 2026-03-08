import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movie_id: {
      type: Number,
      required: true,
    },

    title: String,
    poster_path: String,

    media_type: {
      type: String,
      default: "movie",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);