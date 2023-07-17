const { Schema, model } = require("mongoose");
const Thought = require("./Thought");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is required."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email address.",
      ],
    },
    thoughtsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// This is a virtual called friendCount that retrieves the length of the user's friends array field on query.
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// This is a pre hook that will be called after 'findOneAndUpdate' is called on a user.
UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // We grab the updated fields from the query
    const updatedFields = this.getUpdate();
    // If the updated fields include the email field
    if (updatedFields.email) {
      // We check if the email is valid using regex
      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        updatedFields.email
      );
      // If the email is not valid
      if (!emailIsValid) {
        // We return an error message
        return next("Invalid email format");
      }
    }
    // Otherwise we continue on
    next();
  } catch (err) {
    next(err);
  }
});

// This is a post hook that will be called after 'findOneAndDelete' is called on a user.
UserSchema.post("findOneAndDelete", async function (root) {
  try {
    // If the user exists
    if (root) {
      // We delete all the thoughts associated with the user
      await Thought.deleteMany({
        // We delete all the thoughts that have an _id that is in the user's thoughtsId array
        _id: {
          $in: root.thoughtsId,
        },
      });
    }
  } catch (err) {
    next(err);
  }
});

// The User model is created using the UserSchema
const User = model("User", UserSchema);

module.exports = User;
