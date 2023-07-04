const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000

const app = express();

// conenction to mongodb
const mongoURI = "mongodb://localhost/todo_express";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional code
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");



// routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))


// server configurations....
app.listen(port, () => console.log(`Server started listening on port: ${port}`));
