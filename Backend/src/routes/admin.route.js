import express from "express";
import User from "../models/user.model.js"
import Movie from "../models/movie.model.js";
import authUser from "../middleware/auth.middleware.js"
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

// Get users
router.get("/users", authUser,isAdmin, async (req, res) => {
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const users = await User.find();

  res.json(users);
 
});

// Delete user
router.delete("/users/:id", authUser, isAdmin,async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// Ban user
router.put("/users/:id/ban", authUser,isAdmin, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });

  res.json({ success: true, user });
});

// Unban user
router.put("/users/:id/unban", authUser,isAdmin, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });

  res.json({ success: true, user });
});

// Add custom movie
router.post("/movies", authUser,isAdmin, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const movie = await Movie.create(req.body);

  res.json(movie);
});

// Get movies
router.get("/movies", async (req, res) => {
  const movies = await Movie.find();

  res.json(movies);
});

// Delete movie
router.delete("/movies/:id", authUser,isAdmin, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  await Movie.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// Update movie
router.put("/movies/:id", authUser,isAdmin, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.json(movie);
});

export default router;