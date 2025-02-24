const express = require("express");
const router = express.Router();
const Message = require("../models/message.js");
const verifyToken = require("../middleware/verify-token");

router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const message = await Message.create(req.body);
    message._doc.author = req.user;
    console.log("Creating message:", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
