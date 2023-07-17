const { User, Thought } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "thoughtsId",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v -email -thoughtsId -friends",
      });

    if (!user) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    res.json(user);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};

const createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.create({ username, email });
    res.json(user);
  } catch ({ err }) {
    res.status(500).json({ err });
  }
};

module.exports = { getAllUsers, getUser, createUser };
