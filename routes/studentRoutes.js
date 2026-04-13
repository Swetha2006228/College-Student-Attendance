import express from "express";
import {
  createStudent,
  deleteStudent,
  editStudentName,
  getStudentlist,
} from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/create", verifyToken, createStudent);
router.put(
  "/edit-studentname/classid/:classid/studentid/:studentid",
  editStudentName
);
router.get("/student-list", verifyToken, getStudentlist);
router.delete("/deletestudent/studentid/:studentid", deleteStudent);

export default router;
