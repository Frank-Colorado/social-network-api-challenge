const router = require("express").Router();
const apiRoutes = require("./apiRoutes");

// This is the main route that will be used to access the API
router.use("/api", apiRoutes);

module.exports = router;
