import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
import { validateAuthRegister, validateAuthLogin } from "../middlewares/auth.middleware.js";
import { authenticate, isAllowed } from "../middlewares/common.middleware.js";

const router = express.Router();

router.post('/register', validateAuthRegister, registerUser);
router.post('/login', validateAuthLogin, loginUser);
router.get('/me', authenticate, isAllowed('user'), getMe);

export default router;