import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  classid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  records: [
    {
      studentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
    },
  ],
});

export default mongoose.model("Attendance", attendanceSchema);
