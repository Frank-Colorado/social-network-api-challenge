const { Thought, User } = require("../models");

// This is a controller function that will be called when the route '/api/thoughts' is hit with a GET request
const getAllThoughts = async (_req, res) => {
  try {
    // We find all the thoughts in the database
    const thoughts = await Thought.find({});
    // We return the thoughts as JSON
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts/:id' is hit with a GET request
const getThought = async (req, res) => {
  try {
    // We find the thought by its ID in the database using the req.params.id
    const thought = await Thought.findById(req.params.id);
    // If the thought does not exist
    if (!thought) {
      // We return an error message
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    // Otherwise we return the thought as JSON
    res.json(thought);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts' is hit with a POST request
const createThought = async (req, res) => {
  // We destructure the thoughtText and username from the request body
  const { thoughtText, username } = req.body;
  try {
    // We find the user by their username in the database
    const user = await User.findOne({ username: username });
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this username." });
      return;
    }
    // Otherwise we create a thought using the thoughtText and username
    const thought = await Thought.create({ thoughtText, username });
    // We return the thought as JSON
    res.json(thought);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts/:id' is hit with a PUT request
const updateThought = async (req, res) => {
  // We destructure the thoughtText from the request body
  const { thoughtText } = req.body;
  try {
    // We find the thought by its ID in the database and update it with the thoughtText
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      {
        thoughtText,
      },
      { new: true }
    );
    // If the thought does not exist
    if (!thought) {
      // We return an error message
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    // Otherwise we return the thought as JSON
    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts/:id' is hit with a DELETE request
const deleteThought = async (req, res) => {
  try {
    // We find the thought by its ID in the database and delete it
    const thought = await Thought.findByIdAndDelete(req.params.id);
    // If the thought does not exist
    if (!thought) {
      // We return an error message
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    // Otherwise we return the thought as JSON
    res.json(thought);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts/:id/reactions' is hit with a POST request
const addReaction = async (req, res) => {
  // We destructure the reactionBody and username from the request body
  const { reactionBody, username } = req.body;
  try {
    // We find the user by their username in the database
    const user = await User.findOne({ username: username });
    // If the user does not exist
    if (!user) {
      // We return an error message
      res.status(404).json({ message: "No user found with this username." });
      return;
    }
    // Otherwise we find the thought by its ID in the database and update the reactions array with the reactionBody and username
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );
    // If the thought does not exist
    if (!thought) {
      // We return an error message
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    // Otherwise we return the thought as JSON
    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

// This is a controller function that will be called when the route '/api/thoughts/:thoughtId/reactions/:reactionId' is hit with a DELETE request
const deleteReaction = async (req, res) => {
  // We destructure the thoughtId and reactionId from the request params
  const { thoughtId, reactionId } = req.params;
  try {
    // We find the thought by its ID in the database and update the reactions array by removing the reaction with the reactionId
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );
    // If the thought does not exist
    if (!thought) {
      // We return an error message
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    // Otherwise we return the thought as JSON
    res.json(thought);
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  getAllThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
};
