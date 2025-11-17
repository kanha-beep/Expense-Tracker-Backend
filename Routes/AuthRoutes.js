import express from "express";
import { register, login, currentUser , updateUser} from "../Controllers/AuthController.js";
import WrapAsync from "../Middlewares/WrapAsync.js";
import { VerifyAuth } from "../Middlewares/VerifyAuth.js";
// /api/auth
const router = express.Router();
router.post("/register", WrapAsync(register));
router.post("/login", WrapAsync(login));
router.get("/me", VerifyAuth, WrapAsync(currentUser))
router.patch("/me/edit", VerifyAuth, WrapAsync(updateUser))

export default router;