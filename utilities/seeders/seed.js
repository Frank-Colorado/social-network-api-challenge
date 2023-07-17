const db = require("../config/connection");
const { User, Thought } = require("../../models");

db.on("error", (err) => err);

// db.once("open", async () => {
//     console.log("connected to database");

//     // Delete existing Users
//     await User.deleteMany({});
//     console.log("deleted users");
//     // Delete existing Thoughts
//     await Thought.deleteMany({});
//     console.log("deleted thoughts");
