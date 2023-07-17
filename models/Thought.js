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

// This is a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// This is a post hook that will be called after 'save' is called on a thought.
ThoughtSchema.post("save", async function (doc, next) {
  try {
    // We find the user by their username and update their thoughtsId array with the thought's ID
    await model("User").findOneAndUpdate(
      { username: doc.username },
      { $addToSet: { thoughtsId: doc._id } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

// The Thought model is created using the ThoughtSchema
const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
