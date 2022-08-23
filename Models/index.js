const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  id: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema);
