const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const User = require("./Models/userSchema");
app.use(express.json());
app.use(cors());

const authRoutes = require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoute");


(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/SampleApi");
    console.log("Connect to database");
  } catch (error) {
    console.log(error);
  }
})();

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.get("/", async (req, res) => {
  const id = req.query.id;
  const users = id ? await User.findOne({ id }) : await User.find();
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
