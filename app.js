const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

// Connection to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check MongoDB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
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
