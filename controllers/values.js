const express = require("express");
const router = express.Router();
const Value = require("../models/value.js");
const verifyToken = require("../middleware/verify-token");

router.post("/new", verifyToken, async (req, res) => {
  try {
    req.body.name = req.user._id;
    const values = await Value.create(req.body);
    values._doc.name = req.user;
    res.status(200).json(values);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const values = await Value.find({})
      .populate("name")
      .sort({ createdAt: "desc" });
    res.status(200).json(values);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
