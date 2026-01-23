const User = require("../models/user");
const admin = require("../config/firebaseAdmin");

/**
 * Register or login user with Firebase token
 */
exports.registerOrLogin = async (req, res) => {
    const { token, role: requestedRole } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        let uid, email, name;

        if (admin.apps.length) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            uid = decodedToken.uid;
            email = decodedToken.email;
            name = decodedToken.name || email.split("@")[0];
        } else {
            // Development mode without Firebase Admin cert
            console.warn("DEV MODE: Mocking Firebase verification");
            uid = req.body.uid || "mock_uid";
            email = req.body.email || "mock@example.com";
            name = req.body.name || "Mock User";
        }

        let user = User.findByUid(uid);

        if (user) {
            return res.json({
                message: "Login successful",
                user: { ...user }
            });
        }

        // New user registration
        if (!requestedRole) {
            return res.status(200).json({
                message: "Role selection required",
                newUser: true,
                uid, email, name
            });
        }

        // Validate role
        if (!["doctor", "patient"].includes(requestedRole)) {
            return res.status(400).json({ message: "Invalid role. Must be 'doctor' or 'patient'" });
        }

        // Create new user with selected role
        User.createUser(uid, name, email, requestedRole);
        user = User.findByUid(uid);

        res.status(201).json({
            message: "Registration successful",
            user
        });

    } catch (error) {
        console.error("Auth error:", error);

        // Handle specific Firebase errors
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        if (error.code === 'auth/argument-error') {
            return res.status(400).json({ message: "Invalid token format." });
        }
        if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({ message: "Invalid ID token." });
        }

        res.status(500).json({ message: "Internal server error during authentication", error: error.message });
    }
};

/**
 * Get user profile by Firebase token
 */
exports.getProfile = async (req, res) => {
    try {
        const user = User.findByUid(req.user.uid);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update user role (for testing or admin purposes)
 */
exports.updateRole = async (req, res) => {
    const { role } = req.body;

    if (!["doctor", "patient"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'doctor' or 'patient'" });
    }

    try {
        User.updateRole(req.user.uid, role);
        const user = User.findByUid(req.user.uid);

        res.json({
            message: "Role updated successfully",
            user
        });
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Legacy register endpoint for backward compatibility
 */
exports.register = (req, res) => {
    const { uid, name, email, role } = req.body;

    if (!uid || !name || !email || !role) {
        return res.status(400).json({ message: "Missing required fields: uid, name, email, role" });
    }

    if (!["doctor", "patient"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'doctor' or 'patient'" });
    }

    try {
        User.createUser(uid, name, email, role);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
