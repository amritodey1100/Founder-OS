import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All routes protected with authentication
router.use(verifyToken);

/**
 * GET /api/columns
 * Fetch user's columns (creates user if first time)
 */
router.get("/", async (req, res) => {
  try {
    let user = await User.findOne({ firebaseUid: req.user.uid });

    // Create user if doesn't exist (first login)
    if (!user) {
      user = new User({
        firebaseUid: req.user.uid,
        email: req.user.email,
        name: req.user.name,
      });
      await user.save();
    }

    res.json({ columns: user.columns });
  } catch (error) {
    console.error("Error fetching columns:", error);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

/**
 * Validate column structure
 */
const validateColumns = (columns) => {
  if (!Array.isArray(columns)) return false;

  return columns.every((col) => {
    // Check column has required fields
    if (!col.id || !col.title || !col.color) return false;

    // Check items is an array
    if (!Array.isArray(col.items)) return false;

    // Check each item has required fields
    return col.items.every(
      (item) =>
        item.id &&
        typeof item.title === "string" &&
        (item.description === undefined || typeof item.description === "string")
    );
  });
};

/**
 * PUT /api/columns
 * Update all columns
 */
router.put("/", async (req, res) => {
  try {
    const { columns } = req.body;

    if (!validateColumns(columns)) {
      return res.status(400).json({
        error:
          "Invalid column structure. Each column must have id, title, color, and items array.",
      });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        columns,
        lastUpdated: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({ columns: user.columns });
  } catch (error) {
    console.error("Error updating columns:", error);
    res.status(500).json({ error: "Failed to update columns" });
  }
});

/**
 * POST /api/columns/migrate
 * One-time migration from localStorage
 */
router.post("/migrate", async (req, res) => {
  try {
    const { columns } = req.body;

    if (!validateColumns(columns)) {
      return res.status(400).json({
        error: "Invalid column structure for migration",
      });
    }

    // Check if user already has data
    let user = await User.findOne({ firebaseUid: req.user.uid });

    if (user && user.columns.length > 0) {
      // Don't overwrite existing data
      return res.status(409).json({
        error: "User already has data. Migration aborted to prevent data loss.",
      });
    }

    // Create or update user with migrated data
    user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        firebaseUid: req.user.uid,
        email: req.user.email,
        name: req.user.name,
        columns,
        lastUpdated: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Migration completed successfully",
      columns: user.columns,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    res.status(500).json({ error: "Migration failed" });
  }
});

export default router;
