import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", protectRoute, createTask);
router.get("/", protectRoute, getTasks);
router.put("/:id", protectRoute, updateTask);

export default router;