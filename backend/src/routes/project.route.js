import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { createProject, getProjects } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protectRoute, authorizeRoles("admin"), createProject);
router.get("/", protectRoute, getProjects);

export default router;