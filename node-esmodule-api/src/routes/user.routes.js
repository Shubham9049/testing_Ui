import {
  CreateUser,
  GetUser,
  GetUserById,
  UpdatUser,
  DeleteById,
  Login,
} from "../controllers/user.controller.js";
import express from "express";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", CreateUser);
router.post("/login", Login);
router.get("/", auth, GetUser);
router.patch("/:id", UpdatUser);
router.get("/:id", GetUserById);
router.delete("/:id", DeleteById);

export default router;
