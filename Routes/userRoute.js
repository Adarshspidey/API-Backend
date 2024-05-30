const express = require("express");
const router = express.Router();
const multer = require("multer");
const Admin = require("../Models/adminSchema");
const User = require("../Models/userSchema");
const auth = require("../Utils/JWT");

const upload = multer({
  storage: multer.memoryStorage(),
});

// Get the list of users for the logged-in admin
router.get("/users", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin).populate("userList");
    res.json(admin.userList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
});

// Add a user to the logged-in admin's userList
router.post("/users", auth, upload.single("profilePic"), async (req, res) => {
  const { name, age, mark } = req.body;
  const profilePic = req.file;

  try {
    const admin = await Admin.findById(req.admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newUser = new User({
      name,
      age,
      mark,
      profilePic: profilePic.buffer.toString("base64"), // Save the image as a base64 string
    });

    const savedUser = await newUser.save();
    admin.userList.push(savedUser._id);
    await admin.save();
    res.status(201).json({ message: "User added to list", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user
router.put("/users/:id", auth, upload.single("profilePic"),
  async (req, res) => {
    const { name, age, mark } = req.body;
    const profilePic = req.file;

    try {
      const admin = await Admin.findById(req.admin);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      let updateData = { name, age, mark };
      if (profilePic) {
        updateData.profilePic = profilePic.buffer.toString("base64");
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a user
router.delete("/users/:id", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await userToDelete.remove();
    admin.userList.pull(userToDelete._id);
    await admin.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
