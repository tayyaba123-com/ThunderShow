import { Router } from "express";
import authController  from "../controllers/auth.controllers.js";

// const authController = require("../controllers/auth.controller")
import authUser from "../middleware/auth.middleware.js"
// const authMiddleware = require("../middlewares/auth.middleware")
const router = Router();


router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

router.get("/get-me", authUser, authController.getMe)

router.get("/logout", authController.logoutUser)

export default router
