import express from "express";
import {
  createClass,
  deleteClass,
  getClassesByYear,
  getAllSections,
  getAllYears,
} from "../controllers/classController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/create-class", verifyToken, createClass);
router.delete("/delete-class/class-id/:classid", verifyToken, deleteClass);
router.get("/get-allyear", verifyToken, getAllYears);
router.get("/get-allsection", verifyToken, getAllSections);

router.get("/get-classes-by-year", verifyToken, getClassesByYear);

export default router;
