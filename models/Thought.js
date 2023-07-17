const { Schema, model } = require("mongoose");
const ReactionSchema = require("./Reaction");
const { formatDate } = require("../utilities/formatDate");

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
      get: (createdAtVal) => formatDate(createdAtVal),
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

// Hook that adds the thought to the user's thoughts array field
ThoughtSchema.post("save", async function (doc, next) {
  try {
    const user = await model("User").findOneAndUpdate(
      { username: doc.username },
      { $addToSet: { thoughtsId: doc._id } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
