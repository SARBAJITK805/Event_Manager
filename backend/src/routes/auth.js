const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
require("dotenv").config();

// 🔹 REGISTER Route
router.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging log

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        console.log("Password received:", password); // Debugging log

        const newUser = new User({
            fullname,
            email,
            password, // The password gets hashed automatically in `UserSchema.pre("save")`
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            token,
            user: { id: newUser._id, fullname, email },
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error("Registration Error:", error); // Log exact error
        res.status(500).json({ message: "Server error" });
    }
});


// 🔹 LOGIN Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("🔹 Login Attempt:", email, password);

    try {
        if (!email || !password) {
            console.log("⛔ Missing email or password");
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log("⛔ No user found with email:", normalizedEmail);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ User Found:", user.email, "Stored Hashed Password:", user.password);

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔹 Password Entered:", password);
        console.log("🔹 Bcrypt Comparison Result:", isMatch);

        if (!isMatch) {
            console.log("⛔ Incorrect password for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ Password matched! Generating token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.json({
            token,
            user: { id: user._id, fullname: user.fullname, email: user.email },
        });

    } catch (error) {
        console.error("⛔ Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
