const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const ApiResponse = require('../utils/ApiResponse.js')
require("dotenv").config();

// Register
router.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging log

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newuser = await User.create({ fullname, email, password: hashedPassword });

        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            token,
            user: { id: newuser._id, fullname, email },
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error("Error:", error); // Log exact error
        res.status(500).json({ message: "Server error" });
    }
});


// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.json({ token, user: { id: user._id, fullname: user.fullname, email } });
    } catch (error) {
        console.error("Error:", error); // Log exact error
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
