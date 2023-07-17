const { Thought } = require("../models");

const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};

const getThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    res.json(thought);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};
