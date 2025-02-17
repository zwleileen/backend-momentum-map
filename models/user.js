const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 3,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = model("User", userSchema);
