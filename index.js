const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const User = require("./Models");
app.use(express.json());
app.use(cors());

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/SampleApi");
    console.log("Connect to database");
  } catch (error) {
    console.log(error);
  }
})();

app.post("/", async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    id: Math.random().toString(36).slice(2, 9),
  });
  await newUser.save();
  res.send("User created");
});

app.get("/", async (req, res) => {
  const id = req.query.id;
  const users = id ? await User.findOne({ id }) : await User.find();
  res.send(users);
});

app.put("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(401).send("Invalid Id");
  const result = await User.findOneAndUpdate({ id }, { ...req.body });
  if (!result) return res.status(401).send("User Doesnot Exist");
  res.send("User Updated Succesfully");
});

app.delete("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(401).send("Invalid Id");
  const result = await User.findOneAndDelete({ id });
  if (!result) return res.status(401).send("User Doesnot Exist");
  res.send("User Deleted Succesfully");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
