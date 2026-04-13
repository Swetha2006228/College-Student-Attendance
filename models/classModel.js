import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
    trim: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  teacherid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});
classSchema.index(
  { year: 1, classname: 1, section: 1 },
  { unique: true }
);


export const Class = mongoose.model("Class", classSchema);
