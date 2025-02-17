const express = require("express");
const router = express.Router();
const Value = require("../models/value.js");
const verifyToken = require("../middleware/verify-token");

router.post("/new", verifyToken, async (req, res) => {
  try {
    console.log("Received values data:", req.body);
    console.log("User from token:", req.user);

    // Restructure the data to match the schema
    const valueData = {
      name: req.user._id,
      values: {
        // Nest the values under a 'values' object
        Universalism: req.body.Universalism,
        Benevolence: req.body.Benevolence,
        Tradition: req.body.Tradition,
        Conformity: req.body.Conformity,
        Security: req.body.Security,
        Power: req.body.Power,
        Achievement: req.body.Achievement,
        Hedonism: req.body.Hedonism,
        Stimulation: req.body.Stimulation,
        SelfDirection: req.body.SelfDirection,
      },
    };

    console.log("Creating value with data:", valueData);

    const values = await Value.create(valueData);
    // Populate the user data if needed
    const populatedValues = await Value.findById(values._id).populate("name");

    console.log("Created values:", populatedValues);

    res.status(201).json(populatedValues);
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
