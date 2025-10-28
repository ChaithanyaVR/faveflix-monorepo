import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Connect Database
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
