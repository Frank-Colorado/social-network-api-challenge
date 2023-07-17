const { Thought } = require("../models");

const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};
