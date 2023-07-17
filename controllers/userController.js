const { User } = require("../models");

// This is a controller function that will be called when the route '/api/users' is hit with a GET request
const getAllUsers = async (_req, res) => {
  try {
    // We find all the users in the database
    const users = await User.find({});
    // We return the users as JSON
    res.json(users);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users/:id' is hit with a GET request
const getUser = async (req, res) => {
  try {
    // We find the user by its ID in the database using the req.params.id
    const user = await User.findById(req.params.id)
      // We populate the thoughtsId field with the thoughtText, createdAt, and reactions fields
      .populate({
        path: "thoughtsId",
        select: "thoughtText createdAt reactions",
      })
      // We populate the friends field with the username field
      .populate({
        path: "friends",
        select: "username",
      });
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    // Otherwise we return the user as JSON
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users' is hit with a POST request
const createUser = async (req, res) => {
  // We destructure the username and email from the request body
  const { username, email } = req.body;
  try {
    // We create a user using the username and email
    const user = await User.create({ username, email });
    // We return the user as JSON
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users/:id' is hit with a PUT request
const updateUser = async (req, res) => {
  // We destructure the username and email from the request body
  const { username, email } = req.body;
  try {
    // We find the user by its ID in the database and update it with the username and email
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
      },
      { new: true }
    );
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    // Otherwise we return the user as JSON
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users/:id' is hit with a DELETE request
const deleteUser = async (req, res) => {
  try {
    // We find the user by its ID in the database and delete it
    const user = await User.findByIdAndDelete(req.params.id);
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    // Otherwise we return a message saying the user was deleted
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users/:userId/friends/:friendId' is hit with a POST request
const addFriend = async (req, res) => {
  // We destructure the userId and friendId from the request params
  const { userId, friendId } = req.params;
  try {
    // We find the user by its ID in the database and update the friends array with the friendId
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    // Otherwise we return the user as JSON
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/users/:userId/friends/:friendId' is hit with a DELETE request
const removeFriend = async (req, res) => {
  // We destructure the userId and friendId from the request params
  const { userId, friendId } = req.params;
  try {
    // We find the user by its ID in the database and update the friends array by removing the friendId
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    // Otherwise we return the user as JSON
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};
