import userModel from "../models/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";


async function registerUser(req, res) {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if (isAlreadyRegistered) {
        return res.status(400).json({
            message: "User with the same email or username already exists"
        });
    }

    // 2. Decide the role (using your email as the decider)
    const adminEmails = ["hina@gmail.com"];
    const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

    // 3. Hash the password
    const hash = await bcrypt.hash(password, 10);

    // 4. Create the user with the role
    const user = await userModel.create({
        username,
        email: email.toLowerCase(),
        password: hash,
        role: role // <--- Role added here
    });

    // 5. Sign the token (Include 'role' inside the payload)
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role // <--- Crucial for the isAdmin middleware
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    );
console.log(token)
    // 6. Set the cookie and respond
       res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role // Now returns 'admin' if you used your email
        }
    });
}

async function loginUser(req, res) {
    const { email, password, username } = req.body;

    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function logoutUser(req, res) {

    const token = req.cookies.token

    res.clearCookie("token")

    await redis.set(token, Date.now().toString(), "EX", 60 * 60)

    res.status(200).json({
        message: "logout successfully."
    })
}
export default {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};
