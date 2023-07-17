const { User, Thought } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};
