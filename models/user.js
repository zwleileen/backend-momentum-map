const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema(
  {
    //? username: String
    username: {
      type: String,
      minLength: 3,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },

    // password: {
    //   type: String,
    //   minLength: 3,
    //   required: true,
    // },

    friendslist: {
      type: Schema.Types.ObjectId,
      ref: "Friend",
    },
  },
  { timestamps: true }
);

//* when res.json(user) -> strip out the password hash
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = model("User", userSchema);
