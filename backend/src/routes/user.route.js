import express from 'express'

const router = express.Router();

router.get("/", protectRoute, authorizeRoles("admin"), getAllUsers);