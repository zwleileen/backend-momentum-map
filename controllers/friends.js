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
    }).populate("requester"); // Populated wrong person. Hahahaha "requester" is the correct one

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

router.put("/accept/update", verifyToken, async (req, res) => {
  try {
    const { status, updateId } = req.body; // MongoDB ID. NOT requester or recipient ID.
    const currentUserId = req.user._id;

    //https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
    const currentUpdate = await Friend.findOneAndUpdate(
      {
        _id: updateId,
        recipient: currentUserId, // Security check to ensure recipient is current user
      },
      {
        //if current status is pending
        status: status, // before is pending. after is accepted.
        // Friend.create ({
        // requester = recipiet
        // })
      },
      { new: true } // Added this to return the updated document instead of the old one
    );

    if (!currentUpdate) {
      return res
        .status(404)
        .json({ error: "Friends Log not found or unauthorised." });
    }

    res.json({ currentUpdate });
  } catch (err) {
    console.error("accepting friends error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//-------------- old way using params --------- (a) redoing with queries over body. Look at /accept and /accept/update.

// router.put("/accept/:requestId", verifyToken, async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const currentUserId = req.user._id;

//     const friendRequest = await Friend.findById(requestId);
//     if (!friendRequest) {
//       return res.status(404).json({ error: "Friend request not found" });
//     }

//     if (friendRequest.recipient.toString() !== currentUserId.toString()) {
//       return res
//         .status(403)
//         .json({ error: "Not authorized to accept this request" });
//     }

//     if (friendRequest.status !== "pending") {
//       return res.status(400).json({ error: "Friend request is not pending" });
//     }

//     friendRequest.status = "accepted";
//     friendRequest.acceptedAt = new Date();
//     await friendRequest.save();

//     await Friend.create({
//       requester: friendRequest.recipient,
//       recipient: friendRequest.requester,
//       status: "accepted",
//       acceptedAt: new Date(),
//     });

//     res.json({
//       message: "Friend request accepted",
//       friendship: friendRequest,
//     });
//   } catch (error) {
//     console.error("Error accepting friend request:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// hardcoded works
router.get("/", verifyToken, async (req, res) => {
  try {
    const friends = await Friend.find({
      requester: "67b2c9e046c71c3e7384efa6",
      status: "accepted",
    }).populate("recipient");
    console.log(friends);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// test 1
router.get("/", verifyToken, async (req, res) => {
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

module.exports = router;
