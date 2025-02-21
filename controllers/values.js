const express = require("express");
const router = express.Router();
const Value = require("../models/value.js");
const verifyToken = require("../middleware/verify-token");

router.post("/", verifyToken, async (req, res) => {
  try {
    const valueData = {
      name: req.user._id,
      values: {
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
    const populatedValues = await Value.findById(values._id).populate("name");

    console.log("Created values:", populatedValues);

    res.status(201).json(populatedValues);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/matches", verifyToken, async (req, res) => {
  try {
    console.log("user id from token:", req.user._id);
    const userValues = await Value.findOne({ name: req.user._id });

    if (!userValues) {
      return res.status(404).json({ error: "User values not found." });
    }

    //helper function for formatting
    const formatValueName = (valueName) => {
      if (valueName === "SelfDirection") {
        return "Self-Direction";
      }
      return valueName;
    };

    //helper function to get top 3 values of any user
    const getTop3Values = (valuesObj) => {
      return Object.entries(valuesObj)
        .map(([name, score]) => ({ name: formatValueName(name), score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    };

    //get top 3 values of the current user
    const userTop3 = getTop3Values(userValues.values);
    console.log(userTop3);

    const matchedUsers = await Value.find({ name: { $ne: req.user._id } }) //ne means find values that _id !== user._id
      .populate("name")
      .lean(); //converts mongodb doc into plain JavaScript objects, filters out details like Mongoose method
    // console.log(matchedUsers);

    const matches = matchedUsers
      .map((otherUser) => {
        const otherUsersTop3 = getTop3Values(otherUser.values);

        // Count matching values
        const matchedCount = userTop3.filter((value) =>
          otherUsersTop3.some((otherValue) => otherValue.name === value.name)
        ).length;

        return {
          user: { _id: otherUser.name._id, username: otherUser.name.username },
          matchedValues: matchedCount,
          top3Values: otherUsersTop3,
        };
      })
      .filter((match) => match.matchedValues > 0)
      .sort((a, b) => b.matchedValues - a.matchedValues);

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const values = await Value.findOne({ name: req.params.userId }).populate(
      "name"
    );

    if (!values) {
      return res.status(404).json({
        error: "Values not found for this user",
      });
    }

    console.log("Found values:", values);

    // Check permissions:
    // if (values.name._id.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ error: "Unauthorized access!" });
    // }

    res.status(200).json(values);
  } catch (error) {
    console.error("Error fetching values:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update", verifyToken, async (req, res) => {
  try {
    const existingValues = await Value.findOne({ name: req.user._id });

    if (!existingValues) {
      return res.status(404).json({ error: "Values not found" });
    }

    existingValues.values = req.body;
    await existingValues.save();

    res.status(200).json(existingValues);
  } catch (error) {
    console.error("Error updating values:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const values = await Value.find({}).populate("name");

    res.json(values);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
