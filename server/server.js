import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import columnsRoutes from "./routes/columns.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  console.error("Please create a .env file with MONGODB_URI");
  process.exit(1);
}

if (!process.env.MONGODB_URI.startsWith("mongodb")) {
  console.error("❌ Invalid MONGODB_URI format");
  console.error('URI must start with "mongodb://" or "mongodb+srv://"');
  process.exit(1);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Vite dev server
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/", limiter); // Apply rate limit to all API routes

// Routes
app.use("/api/columns", columnsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Founder OS API is running" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API ready at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n👋 Server shutting down gracefully");
  process.exit(0);
});
