// controllers/user.controller.js
import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // Exclude admins from the list if you only want to assign tasks to members, 
    // or just fetch everyone. We will fetch everyone but exclude passwords.
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// routes/user.route.js
// Add this: router.get("/", protectRoute, authorizeRoles("admin"), getAllUsers);