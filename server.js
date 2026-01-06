import dotenv from "dotenv";
import express from "express";
import cors from "cors";  
import teacherRoute from "./routes/teacherRoute.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
connectDB();
app.use("/api", teacherRoute);
app.use("/api/auth", authRoutes);
app.use("/", classRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
