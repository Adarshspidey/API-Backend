const express = require("express");
const router = express.Router();
const Admin = require("../Models/adminSchema"); // Adjust the path as needed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePasswords } = require("../Utils/Bcrypt");

// Sign up route for admin
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }
    let hashpassword = await hashPassword(password);

    const newAdmin = new Admin({
      name,
      email,
      password:hashpassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Login route for admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await comparePasswords(password,admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: admin._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
