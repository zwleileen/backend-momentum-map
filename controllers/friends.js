const express = require("express");
const router = express.Router();
const Friend = require("../models/friend");
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");

router.post("/request", verifyToken, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id; // Get authenticated user's ID

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ error: "Recipient not found" });

    const existingRequest = await Friend.findOne({ requester: requesterId, recipient: recipientId });
    if (existingRequest) return res.status(400).json({ error: "Friend request already sent" });

    const friendRequest = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({ message: "Friend request sent", friendRequest });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/accept/:requestId", verifyToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    // ✅ 1. Find the friend request
    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // ✅ 2. Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== currentUserId.toString()) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }

    // ✅ 3. Check if request is pending
    if (friendRequest.status !== "pending") {
      return res.status(400).json({ error: "Friend request is not pending" });
    }

    // ✅ 4. Update the friend request status
    friendRequest.status = "accepted";
    friendRequest.acceptedAt = new Date();
    await friendRequest.save();

    // ✅ 5. Create a reverse friendship record (optional but recommended)
    await Friend.create({
      requester: friendRequest.recipient,
      recipient: friendRequest.requester,
      status: "accepted",
      acceptedAt: new Date()
    });

    res.json({
      message: "Friend request accepted",
      friendship: friendRequest
    });

  } catch (error) {
    console.error("❌ Error accepting friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
module.exports = router;
