import express from "express";
import Favorite from "../models/faviourt.model.js"
import authUser from "../middleware/auth.middleware.js"


const router = express.Router();

// Get favorites
router.get("/", authUser, async (req, res) => {
 
  const favorites = await Favorite.find({ user_id: req.user.id });

  res.json(favorites);
});

// Add favorite
router.post("/", authUser, async (req, res) => {
  const { movie_id, title, poster_path, media_type } = req.body;

  const favorite = await Favorite.create({
    user_id: req.user.id,
    movie_id,
    title,
    poster_path,
    media_type,
  });

  res.json(favorite);
});

// Delete favorite
router.delete("/:movie_id", authUser, async (req, res) => {
  await Favorite.deleteOne({
    user_id: req.user.id,
    movie_id: req.params.movie_id,
  });

  res.json({ success: true });
});

export default router

