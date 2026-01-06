import express from "express";
import { validateLogin } from "../middlewares/validateMiddleware.js";
import { loginController } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", validateLogin, loginController);

export default router;
