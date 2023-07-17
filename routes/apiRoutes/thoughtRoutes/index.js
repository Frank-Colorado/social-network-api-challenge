const router = require("express").Router();
const {
  getAllThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../../controllers/thoughtController");

// /api/thoughts
router.route("/").get(getAllThoughts).post(createThought);

// /api/thoughts/:id
router.route("/:id").get(getThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:id/reactions
router.route("/:id/reactions").post(addReaction).delete(deleteReaction);

module.exports = router;
