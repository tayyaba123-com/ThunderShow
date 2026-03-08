import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    poster_url: String,

    description: String,

    release_date: String,

    trailer_url: String,

    genre: String,

    category: String,
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);