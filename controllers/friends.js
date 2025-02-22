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
    if (!recipient)
      return res.status(404).json({ error: "Recipient not found" });

    const existingRequest = await Friend.findOne({
      requester: requesterId,
      recipient: recipientId,
    });
    if (existingRequest)
      return res.status(400).json({ error: "Friend request already sent" });

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

router.put("/accept", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const currentUserId = req.user._id;
    if (!status || !currentUserId) {
      return res.status(400).json({ error: "Not enough Params" });
    }

    const currentUserRequests = await Friend.find({
      //getting list base on 2 param - status and recipient id
      status: status,
      recipient: currentUserId,
    }).populate("recipient");

    if (!currentUserRequests || currentUserRequests.length === 0) {
      return res.status(404).json({ error: "You have no friend requests." });
    }

    console.log(currentUserRequests);
    res.json({ currentUserRequests });
  } catch (err) {
    console.error("accepting friends error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const friends = await Friend.find({
      requester: requesterId,
      status: "accepted",
    }).populate("recipient");
    console.log(friends);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

  router.delete("/:userId", verifyToken, async (req, res) => {
    const deleteId = req.params.userId;

  });

  // router.delete("/:hootId", verifyToken, async (req, res) => {
  //   try {
  //     const hoot = await Hoot.findById(req.params.hootId);
  
  //     if (!hoot.author.equals(req.user._id)) {
  //       return res.status(403).send("You're not allowed to do that!");
  //     }
  
  //     const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
  //     res.status(200).json(deletedHoot);
  //   } catch (err) {
  //     res.status(500).json({ err: err.message });
  //   }
  // });

module.exports = router;
