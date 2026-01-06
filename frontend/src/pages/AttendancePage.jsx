import React, { useEffect, useState } from "react";
import { Lock, Edit, Save } from "lucide-react";

const AttendancePage = ({ classid }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [isEditable, setIsEditable] = useState(true);

  // determine if date can be edited
  const checkEditable = (date) => {
    const today = new Date().toISOString().slice(0, 10);
    return date === today;
  };

  //  fetch students for class
  const fetchStudents = async () => {
    const res = await fetch(`/api/student/student-list?classid=${classid}`);

    const data = await res.json();
    if (data.success) setStudents(data.studentslist);
  };

  //fetch attendance if exists
  const fetchAttendance = async (date) => {
    try {
      const res = await fetch(
        `/api/attendance/get?classid=${classid}&date=${date}`
      );
      const data = await res.json();

      if (data.success && data.attendance) {
        const formatted = {};
        data.attendance.records.forEach((rec) => {
          formatted[rec.studentid._id] = rec.status;
        });
        setAttendance(formatted);
      } else {
        const emptyState = {};
        students.forEach((st) => (emptyState[st._id] = "Absent"));
        setAttendance(emptyState);
      }
    } catch {
      const emptyState = {};
      students.forEach((st) => (emptyState[st._id] = "Absent"));
      setAttendance(emptyState);
    }
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setIsEditable(checkEditable(newDate));
    fetchAttendance(newDate);
  };

  //  toggle attendance for student
  const toggleAttendance = (studentid) => {
    if (!isEditable) return;
    setAttendance((prev) => ({
      ...prev,
      [studentid]: prev[studentid] === "Present" ? "Absent" : "Present",
    }));
  };

  //  save attendance
  const saveAttendance = async () => {
    const recordsArray = Object.keys(attendance).map((id) => ({
      studentid: id,
      status: attendance[id],
    }));

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classid,
        date: selectedDate,
        records: recordsArray,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Attendance saved!");
    }
  };

  useEffect(() => {
    fetchStudents().then(() => {
      fetchAttendance(selectedDate);
    });
  }, []);

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
        Attendance {isEditable ? <Edit size={18} /> : <Lock size={18} />}
      </h2>

      <input
        type='date'
        value={selectedDate}
        onChange={handleDateChange}
        className='border p-2 rounded mb-4'
      />

      <div className='border rounded p-4'>
        {students.map((st) => (
          <div
            key={st._id}
            className='flex justify-between items-center border-b py-2'
          >
            <span>{st.name}</span>

            <button
              onClick={() => toggleAttendance(st._id)}
              className={`px-3 py-1 rounded ${
                attendance[st._id] === "Present"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              } ${!isEditable && "opacity-50 cursor-not-allowed"}`}
            >
              {attendance[st._id]}
            </button>
          </div>
        ))}
      </div>

      {isEditable && (
        <button
          onClick={saveAttendance}
          className='mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <Save size={18} /> Save
        </button>
      )}
    </div>
  );
};

export default AttendancePage;
