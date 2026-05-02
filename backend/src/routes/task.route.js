// routes/task.route.js
import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { createTask, getTasks, updateTaskStatus } from "../controllers/task.controller.js";

const router = express.Router();

// Only Admins can create tasks
router.post("/", protectRoute, authorizeRoles("admin"), createTask);

// Both Admins and Members can view tasks (the controller handles filtering)
router.get("/", protectRoute, getTasks);

// Both Admins and Members can update task status (the controller handles permissions)
router.patch("/:id/status", protectRoute, updateTaskStatus); 

export default router;