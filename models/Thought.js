const { Schema, model } = require("mongoose");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought text is required."],
      minlength: [1, "Thought text must be at least 1 character long."],
      maxLength: [280, "Thought text must be less than 280 characters long."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: [true, "Username is required."],
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
