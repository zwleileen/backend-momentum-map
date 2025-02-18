const { Schema, model } = mongoose;

const friendSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User" },
    receipient: {
      type: String,
      required: true,
    },
    status: {
      type: String
  },
},
  { timestamps: true }
);

module.exports = model("Friend", friendSchema);
