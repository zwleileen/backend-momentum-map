const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  values: {
    Universalism: { type: Number, required: true, min: 1, max: 5 },
    Benevolence: { type: Number, required: true, min: 1, max: 5 },
    Tradition: { type: Number, required: true, min: 1, max: 5 },
    Conformity: { type: Number, required: true, min: 1, max: 5 },
    Security: { type: Number, required: true, min: 1, max: 5 },
    Power: { type: Number, required: true, min: 1, max: 5 },
    Achievement: { type: Number, required: true, min: 1, max: 5 },
    Hedonism: { type: Number, required: true, min: 1, max: 5 },
    Stimulation: { type: Number, required: true, min: 1, max: 5 },
    SelfDirection: { type: Number, required: true, min: 1, max: 5 },
  },
});

const Value = mongoose.model("Value", valueSchema);

module.exports = Value;
