const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  createUser,
} = require("../../../controllers/userController");

// /api/users
router.route("/").get(getAllUsers).post(createUser);

// /api/users/:id
router.route("/:id").get(getUser);

module.exports = router;
