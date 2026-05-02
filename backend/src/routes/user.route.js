import express from 'express'
import { getAllUsers } from '../controllers/user.controller.js';
import { authorizeRoles, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", protectRoute, authorizeRoles("admin"), getAllUsers);

export default router;