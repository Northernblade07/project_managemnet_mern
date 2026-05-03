import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; 
        if (!token) {
            return res.status(401).json({ message: "unauthorised - no token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "unauthorised - invalid token found" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "unauthorised - user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized access" });
}
}

// NEW: This is how you restrict routes to Admins only
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied: You do not have the required permissions" 
            });
        }
        next();
    };
};