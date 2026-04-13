import { Class } from "../models/classModel.js";
import { classValidation } from "../validations/classValidation.js";

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({}, { _id: 1, classname: 1 });
    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classes found",
      });
    }

    return res.json({
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createClass = async (req, res) => {
  try {
    const teacherid = req.user.id;

    const { error } = classValidation.validate({
      ...req.body,
      teacherid,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { classname, section, year } = req.body;

    const newClass = new Class({ classname, section, year, teacherid });
    await newClass.save();

    return res.json({
      success: true,
      message: "successfully created",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { classid } = req.params;
    const deletedClass = await Class.findByIdAndDelete(classid);
    if (!deletedClass) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "successfully deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

export const getAllYears = async (req, res) => {
  try {
    const years = await Class.distinct("year");
    if (!years || years.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "no years found" });
    }
    const yearlist = years.map((y) => ({ year: y }));
    return res
      .status(200)
      .json({ success: true, message: "successfully fetched", data: yearlist });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

export const getAllSections = async (req, res) => {
  try {
    const { year, classname } = req.query;

    if (!year || !classname) {
      return res.status(400).json({
        success: false,
        message: "year and classname are required",
      });
    }

    const classes = await Class.find(
      { year: Number(year), classname },
      { _id: 1, section: 1 }
    );

    if (!classes.length) {
      return res.status(404).json({
        success: false,
        message: "no sections found",
      });
    }

    return res.status(200).json({
      success: true,
      data: classes, // ⬅️ includes _id now
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};


export const getClassesByYear = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    const classNames = await Class.distinct("classname", {
      year: Number(year),
    });

    if (!classNames.length) {
      return res.status(404).json({
        success: false,
        message: "No classes found for this year",
      });
    }

    const result = classNames.map((name) => ({
      classname: name,
    }));

    return res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
