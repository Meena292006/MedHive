const admin = require("../config/firebaseAdmin");
const User = require("../models/user");

exports.verifyToken = async (req, res, next) => {
    // Development mode bypass if Firebase Admin is not initialized
    if (!admin.apps.length) {
        const devUid = req.headers["x-user-uid"];
        if (!devUid) {
            return res.status(401).json({
                message: "DEV MODE: Missing x-user-uid header. Refusing to guess a user."
            });
        }

        const user = User.findByUid(devUid);
        if (!user) {
            return res.status(401).json({
                message: "DEV MODE: User not found for provided x-user-uid."
            });
        }

        req.user = { ...user, uid: devUid, dbUser: user };
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;

        // Attach database user record
        const user = User.findByUid(decodedToken.uid);
        if (!user) {
            return res.status(401).json({ message: "User not found in database" });
        }

        req.user.id = user.id;
        req.user.role = user.role;
        req.user.dbUser = user;

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

exports.isAdmin = (req, res, next) => {
    // Can be extended if there's an admin role
    next();
};

exports.isDoctor = async (req, res, next) => {
    try {
        const user = User.findByUid(req.user.uid);
        if (user && user.role === 'doctor') {
            req.user.role = user.role;
            req.user.dbUser = user;
            next();
        } else {
            res.status(403).json({ message: "Access denied. Doctor only." });
        }
    } catch (error) {
        console.error("isDoctor middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.isPatient = async (req, res, next) => {
    try {
        const user = User.findByUid(req.user.uid);
        if (user && user.role === 'patient') {
            req.user.role = user.role;
            req.user.dbUser = user;
            next();
        } else {
            res.status(403).json({ message: "Access denied. Patient only." });
        }
    } catch (error) {
        console.error("isPatient middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
