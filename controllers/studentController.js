import Student from "../models/studentModel.js";

import { validateStudent } from "../validations/studentValidation.js";
export const createStudent = async (req, res) => {
  try {
    const { error } = validateStudent.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const { name, classid } = req.body;
    const newStudent = new Student({ name, classid });
    await newStudent.save();

    return res
      .status(200)
      .json({ success: true, message: "successfully created" });
  } catch (err) {
    console.error("Create Student Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const editStudentName = async (req, res) => {
  try {
    const { classid, studentid } = req.params;
    const { name } = req.body;

    if (!classid || !studentid || !name) {
      return res.status(400).json({
        success: false,
        message: "classid, studentid and name required",
      });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentid, classid },
      { name },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    return res.json({ success: true, message: "successfully updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentid } = req.params;
    if (!studentid) {
      return res
        .status(400)
        .json({ success: false, message: "studentid is required" });
    }
    const deletedStudent = await Student.findByIdAndDelete(studentid);
    if (!deletedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "something went wrong" });
    }
    return res
      .status(200)
      .json({ success: true, message: "successfully deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

export const getStudentlist = async (req, res) => {
  try {
    const { classid } = req.query;
    if (!classid) {
      return res
        .status(400)
        .json({ success: false, message: "classid is required" });
    }
    const studentslist = await Student.find({ classid }).select("name _id");

    return res
      .status(200)
      .json({ success: true, message: "successfully fetched", studentslist });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
