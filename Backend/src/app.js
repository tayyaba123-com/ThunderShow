import  express from 'express';
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors"

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


import authRoutes from "./routes/auth.route.js"
import adminRoutes from "./routes/admin.route.js"
import favoriteRoutes from "./routes/faviroute.route.js"
import historyRoutes from "./routes/history.route.js"

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/history", historyRoutes)

export default app