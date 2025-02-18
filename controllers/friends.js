const verifyToken = require("../middleware/verify-token");
const friend = require("../models/friend");

const express = require("express");
const router = express.Router();
const Friend = require("../models/friend");
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");

// 📌 Send a friend request using Friend.create()
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id; // Get authenticated user's ID

    // ✅ 1. Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ error: "Recipient not found" });

    // ✅ 2. Check if a friend request already exists
    const existingRequest = await Friend.findOne({ requester: requesterId, recipient: recipientId });
    if (existingRequest) return res.status(400).json({ error: "Friend request already sent" });

    // ✅ 3. Create friend request directly (No need for .save())
    const friendRequest = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({ message: "Friend request sent", friendRequest });

  } catch (error) {
    console.error("❌ Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
