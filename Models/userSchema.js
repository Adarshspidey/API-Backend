const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  mark: {
    type: String,
  },
  profilePic: {
    type: String, // URL or file path to the uploaded file
  },
});

module.exports = mongoose.model("User", userSchema);
