import express from "express";
import { addTeacherController } from "../controllers/teacherController.js";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();


router.post(
  "/add-teacher",
  verifyToken,
  isSuperAdmin,
  addTeacherController
);

export default router;
