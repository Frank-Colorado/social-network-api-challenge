const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

mongoose
  .connect("mongodb://127.0.0.1/mongooseTodoAppDb")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
