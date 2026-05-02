import User from "../models/user.model.js"; // Check your exact file name
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    // Added 'role' so you can pass "admin" from Postman/Frontend to create your test admin
    const { fullName, email, password, role } = req.body;
    
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "all fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be strong" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "invalid email format" });
        }
            
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
            role: role || "member" // Default to member if not provided in req.body
        });
    
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        // Hide password from the response
        newUser.password = undefined;

        res.status(201).json({ success: true, message: "user created successfully", user: newUser });

    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "all credentials required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email and password" });
        }

        const isVerified = await user.matchPassword(password);
        if (!isVerified) {
            return res.status(400).json({ message: "invalid email and password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        }); 

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // sameSite: "strict",
            // secure: process.env.NODE_ENV === "production"
        });

        user.password = undefined;
        res.status(200).json({ success: true, message: "login successful", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "internal server issue" });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "logout successful" });
}