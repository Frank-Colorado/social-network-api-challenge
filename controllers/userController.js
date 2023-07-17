const { User } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
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
  } catch (err) {
    res.status(500).json({ err });
  }
};

const createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.create({ username, email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const updateUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
      },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    res.json(user);
  } catch (err) {
    console.log({ err });
    res.status(500).json({ err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ err });
  }
};

const addFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const removeFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
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
