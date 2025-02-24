const express = require("express");
const router = express.Router();
const Message = require("../models/message.js");
const verifyToken = require("../middleware/verify-token");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { recipientId } = req.body.receiver;
    req.body.sender = req.user._id;
    const message = await Message.create(req.body);
    message._doc.sender = req.user;
    console.log("Creating message:", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.params.userId,
    }).populate("sender");

    if (!messages) {
      return res.status(404).json({
        error: "There is no message.",
      });
    }

    console.log("Found messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:messageId", verifyToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(
      req.params.messageId
    );

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found." });
    }

    console.log("Deleted message:", deletedMessage);
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
