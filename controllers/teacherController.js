import teacherModel from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import { validateTeacher } from "../validations/teacherValidation.js";

export const addTeacherController = async (req, res) => {
  try {
    const { error } = validateTeacher.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log("&&&&&&&&&&&&&&&&");

    const { name, email, password } = req.body;

    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ success: false, message: "Teacher already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new teacherModel({
      name,
      email,
      password: hashedPassword,
    });
    await newTeacher.save();
    return res.status(201).json({
      success: true,
      message: "successfully added",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
