import Attendance from "../models/attendanceModel.js";
import { attendanceValidation } from "../validations/attendanceValidation.js";

export const markAttendance = async (req, res) => {
  try {
    const { error } = attendanceValidation.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const { classid, date, records } = req.body;
const existingAttendance = await Attendance.findOne({
  classid,
  date,
});

if (existingAttendance) {
  
  existingAttendance.records = records; 
  await existingAttendance.save();

  return res.status(200).json({
    success: true,
    message: "Attendance updated successfully",
  });
}


const newAttendance = new Attendance({
  classid,
  date,
  records,
});

await newAttendance.save();

return res.status(201).json({
  success: true,
  message: "Attendance saved successfully",
});

  } catch (err) {
    console.error("Attendance Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { classid, date } = req.query;
    if (!classid || !date)
      return res
        .status(400)
        .json({ success: false, message: "classid and date aare required" });
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const attendance = await Attendance.findOne({
      classid,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("records.studentid", "name");

    if (!attendance)
      return res
        .status(404)
        .json({ success: false, message: "no attendance found" });
    return res.status(200).json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
