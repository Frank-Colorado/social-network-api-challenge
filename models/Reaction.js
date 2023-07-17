const { Schema } = require("mongoose");
const { formatDate } = require("../utilities/formatDate");

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: [true, "Reaction is required"],
      maxlength: [280, "Reaction must be less than 280 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => formatDate(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

module.exports = ReactionSchema;
