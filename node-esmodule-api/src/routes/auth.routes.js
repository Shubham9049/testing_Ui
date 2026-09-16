import express from "express";
import { RefreshAccessToken, Logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/refresh", RefreshAccessToken);
router.post("/logout", Logout);

export default router;
