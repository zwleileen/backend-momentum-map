const { Schema, model } = mongoose;

const friendSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Friend", friendSchema);
