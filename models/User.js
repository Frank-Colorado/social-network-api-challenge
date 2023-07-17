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

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const updatedFields = this.getUpdate();
  if (updatedFields.email) {
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedFields.email);
    if (!emailIsValid) {
      return next("Invalid email format");
    }
  }
  next();
});

UserSchema.post("findOneAndDelete", async function (root) {
  if (root) {
    await Thought.deleteMany({
      _id: {
        $in: root.thoughtsId,
      },
    });
  }
});

const User = model("User", UserSchema);

module.exports = User;
