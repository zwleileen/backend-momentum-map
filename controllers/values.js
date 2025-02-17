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

router.get("/:valuesId", verifyToken, async (req, res) => {
  try {
    const values = await Value.findById(req.params.valuesId).populate("name");

    if (!values) {
      return res.status(404).json({ error: "Values not found for this user" });
    }

    console.log("Found values:", values);

    // Check permissions:
    if (values.name._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access!" });
    }

    res.status(200).json(values);
  } catch (error) {
    console.error("Error fetching values:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
