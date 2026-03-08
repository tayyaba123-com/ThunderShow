import express from "express";
import History from "../models/history.model.js";
import authUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authUser, async (req, res) => {
  const history = await History.find({ user_id: req.user.id })
    .sort({ watched_at: -1 })
    .limit(20);

  res.json(history);
});

router.post("/", authUser, async (req, res) => {
  const { movie_id, title, poster_path, media_type } = req.body;

  const history = await History.create({
    user_id: req.user.id,
    movie_id,
    title,
    poster_path,
    media_type,
  });

  res.json(history);
});

export default router;