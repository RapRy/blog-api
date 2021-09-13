const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const topicSchema = new Schema(
  {
    title: String,
    description: String,
    active: Number,
    ref: {
      category: String,
      creator: String,
    },
    meta: {
      replies: [String],
      views: [String],
      upvotes: [String],
      downvotes: [String],
    },
  },
  { timestamps: true }
);

const Topics = model("topic", topicSchema);

module.exports = Topics;
