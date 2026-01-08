import { useEffect, useState, useCallback } from "react";

import PopupModal from "../components/PopupModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ClassPage() {
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [year, setYear] = useState("");
  const [classname, setClassname] = useState("");
  const [section, setSection] = useState("");
  const [classid, setClassid] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isPastDate, setIsPastDate] = useState(false);
  const [isToday, setIsToday] = useState(true);

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const [showClassPopup, setShowClassPopup] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [popupClassName, setPopupClassName] = useState("");
  const [popupSection, setPopupSection] = useState("");
  const [popupYear, setPopupYear] = useState("");
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ---------------- FETCH YEARS ----------------
  const fetchYears = useCallback(async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/get-allyear", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    if (data.success) setYears(data.data);
  }, []);

  // ---------------- FETCH CLASSES ----------------
  const fetchClasses = useCallback(async () => {
    if (!year) return;
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/get-classes-by-year?year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) setClasses(data.data);
  }, [year]);

  // ---------------- FETCH SECTIONS ----------------
  const fetchSections = useCallback(async () => {
    if (!year || !classname) return;
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/get-allsection?year=${year}&classname=${classname}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (data.success) setSections(data.data);
  }, [year, classname]);

  // ---------------- FETCH STUDENTS ----------------
  const fetchStudents = useCallback(async () => {
    if (!classid) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/api/student/student-list?classid=${classid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    console.log("API RESPONSE:", data);

    if (data.success) {
      setStudents(data.studentslist);
      setAttendance(
        Object.fromEntries(data.studentslist.map((s) => [s._id, false]))
      );
    }
  }, [classid]);
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  const handleAddStudent = async () => {
    if (!studentName.trim()) return;
    if (!classid) return alert("Select class first");
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/student/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: studentName, classid: classid }),
    });

    const data = await res.json();

    if (data.success) {
      fetchStudents();
      setStudentName("");
      setShowAddStudentModal(false);
    } else {
      alert(data.message);
    }
  };

  const handleDeleteStudent = async (studentid) => {
    if (!window.confirm("Delete this student?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/api/student/deletestudent/studentid/${studentid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) fetchStudents();
    else alert(data.message);
  };

  // ---------------- FETCH ATTENDANCE ----------------
  const fetchAttendance = useCallback(async () => {
    if (!classid || !date) return;

    const res = await fetch(
      `http://localhost:3000/api/attendance/get?classid=${classid}&date=${date}`
    );
    const data = await res.json();

    const today = new Date().toISOString().split("T")[0];

    setIsPastDate(date < today);
    setIsToday(date === today);

    if (data.success) {
      const mapped = {};
      data.attendance.records.forEach((rec) => {
        mapped[rec.studentid._id] = rec.status === "Present";
      });
      setAttendance(mapped);
    } else {
      if (date < today) {
        setAttendance({});
      } else {
        setAttendance(Object.fromEntries(students.map((s) => [s._id, false])));
      }
    }
  }, [classid, date, students]);

  const handleCreateClass = async () => {
    if (!popupClassName.trim()) return alert("Enter class name");
    if (!popupSection.trim()) return alert("Enter section");
    if (!popupYear.trim()) return alert("Enter year");

    const token = localStorage.getItem("token");
    const teacherid = localStorage.getItem("teacherid");

    if (!teacherid) {
      return alert("Teacher ID missing. Please login again.");
    }

    const res = await fetch("http://localhost:3000/create-class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        classname: popupClassName,
        section: popupSection,
        year: Number(popupYear),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setShowClassPopup(false);
      setPopupClassName("");
      setPopupSection("");
      fetchYears();
      setYear(popupYear);
    } else {
      alert(data.message);
    }
  };

  // ---------------- SAVE ATTENDANCE ----------------
  const saveAttendance = async () => {
    const records = Object.entries(attendance).map(([studentid, status]) => ({
      studentid,
      status: status ? "Present" : "Absent",
    }));

    const res = await fetch("http://localhost:3000/api/attendance/mark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify({ classid, date, records }),
    });

    const data = await res.json();
    alert(data.message);
  };

  // ---------------- AUTO LOAD FLOW ----------------
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col'>
      {classid && (
        <button
          onClick={saveAttendance}
          disabled={!isToday}
          className={`ml-auto mb-4 text-sm px-3 py-1 rounded-md ${
            !isToday
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:shadow-[0_0_20px_rgba(0,102,255,0.7)]"
          }`}
        >
          Save
        </button>
      )}

      {/* FILTER BAR */}
      <div className='flex gap-3 mb-6 relative z-50 overflow-visible'>
        <select
          className='relative z-50 bg-[#121212] p-3 rounded-md border border-gray-700'
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setClassname("");
            setSection("");
            setClassid("");
          }}
        >
          <option value=''>Select Year</option>

          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>

        <select
          className='relative z-50 bg-[#121212] p-3 rounded-md border border-gray-700'
          value={classname}
          onChange={(e) => {
            setClassname(e.target.value);
            setSection("");
            setClassid("");
          }}
        >
          <option value=''>Select Class</option>

          {classes.map((c) => (
            <option key={c._id} value={c.classname}>
              {c.classname}
            </option>
          ))}
        </select>

        <select
          className='relative z-50 bg-[#121212] p-3 rounded-md border border-gray-700'
          value={section}
          onChange={(e) => {
            setSection(e.target.value);
            const selected = sections.find((s) => s.section === e.target.value);
            setClassid(selected ? selected._id : "");
          }}
        >
          <option value=''>Select Section</option>

          {sections.map((s) => (
            <option key={s._id} value={s.section}>
              {s.section}
            </option>
          ))}
        </select>

        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='bg-[#121212] p-3 rounded-md border border-gray-700 text-white 
             [color-scheme:dark]'
        />

        <button
          onClick={() => setShowClassPopup(true)}
          className='px-4 py-2 bg-blue-600 rounded-md flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,102,255,0.7)]'
        >
          <Plus size={18} />
          Create Class
        </button>
      </div>

      <div className='flex gap-6'>
        {/* STUDENTS PANEL */}
        <div className='w-1/3 bg-[#121212] p-4 rounded-xl border border-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.3)]'>
          <div className='flex justify-between items-center mb-3'>
            <h2 className='text-lg font-bold'>Students</h2>

            <button
              onClick={() => {
                setStudentName("");

                setShowAddStudentModal(true);
              }}
              className='text-blue-400 flex items-center gap-1'
            >
              <Plus size={18} />
            </button>
          </div>

          <div className='flex flex-col gap-3 h-[60vh] overflow-y-auto'>
            {students.map((s) => (
              <div
                key={s._id}
                className='flex justify-between items-center bg-[#1a1a1a] p-2 rounded-md'
              >
                <span>{s.name}</span>

                <div className='flex gap-3'>
                  {/* EDIT */}
                  <Pencil
                    size={16}
                    className='text-yellow-400 cursor-pointer'
                    onClick={() => {
                      setSelectedStudent(s);
                      setStudentName(s.name);
                      setShowEditStudentModal(true);
                    }}
                  />

                  {/* DELETE */}
                  <Trash2
                    size={16}
                    className='text-red-500 cursor-pointer hover:scale-110'
                    onClick={() => handleDeleteStudent(s._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATTENDANCE PANEL */}
        <div className='w-2/3 bg-[#121212] p-4 rounded-xl border border-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.3)]'>
          <h2 className='text-lg font-bold mb-3'>
            Attendance {classname && `- ${classname} ${section}`}
          </h2>

          <div className='flex flex-col gap-3 h-[60vh] overflow-y-auto'>
            {students.map((s) => (
              <div
                key={s._id}
                className='flex justify-end items-center bg-[#1a1a1a] p-2 rounded-md'
              >
                <input
                  type='checkbox'
                  disabled={isPastDate}
                  checked={attendance[s._id] || false}
                  onChange={(e) =>
                    setAttendance({ ...attendance, [s._id]: e.target.checked })
                  }
                  className='w-5 h-5'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPUPS */}
      {showAddStudentModal && (
        <PopupModal
          title='Add Student'
          onClose={() => setShowAddStudentModal(false)}
        >
          <input
            type='text'
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder='Enter student name'
            className='w-full p-2 mb-4 rounded bg-[#111] text-white border border-blue-500'
          />

          <div className='flex justify-end'>
            <button
              onClick={handleAddStudent}
              className='px-4 py-2 bg-blue-600 text-white rounded-md border border-transparent
  hover:border-blue-500 hover:shadow-[0_0_20px_rgba(0,102,255,0.7)]
  transition-all duration-300 focus:outline-none hover:bg-blue-600 active:scale-[0.98]'
            >
              Add
            </button>
          </div>
        </PopupModal>
      )}

      {showClassPopup && (
        <PopupModal
          title='Create Class'
          onClose={() => setShowClassPopup(false)}
          size='md'
        >
          <input
            type='text'
            value={popupClassName}
            onChange={(e) => setPopupClassName(e.target.value)}
            placeholder='Enter class name'
            className='w-full p-2 mb-4 rounded bg-[#111] text-white border border-blue-500'
          />
          <input
            type='text'
            value={popupSection}
            onChange={(e) => setPopupSection(e.target.value)}
            placeholder='Enter section'
            className='w-full p-2 mb-4 rounded bg-[#111] text-white border border-blue-500'
          />
          <input
            type='text'
            value={popupYear}
            onChange={(e) => setPopupYear(e.target.value)}
            placeholder='Enter year'
            className='w-full p-2 mb-4 rounded bg-[#111] text-white border border-blue-500'
          />

          <div className='flex justify-end'>
            <button
              onClick={handleCreateClass}
              className='px-4 py-2 bg-blue-600 text-white rounded-md border border-transparent
  hover:border-blue-500 hover:shadow-[0_0_20px_rgba(0,102,255,0.7)]
  transition-all duration-300 focus:outline-none hover:bg-blue-600 active:scale-[0.98]'
            >
              Save
            </button>
          </div>
        </PopupModal>
      )}
      {showEditStudentModal && selectedStudent && (
        <PopupModal
          title='Edit Student'
          onClose={() => setShowEditStudentModal(false)}
        >
          <input
            type='text'
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className='w-full p-2 mb-4 rounded bg-[#111] text-white border border-yellow-500'
          />

          <div className='flex justify-end'>
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");

                const res = await fetch(
                  `http://localhost:3000/api/student/edit-studentname/classid/${classid}/studentid/${selectedStudent._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: studentName }),
                  }
                );

                const data = await res.json();

                if (data.success) {
                  fetchStudents();
                  setShowEditStudentModal(false);
                  setSelectedStudent(null);
                  setStudentName("");
                } else {
                  alert(data.message);
                }
              }}
              className='px-4 py-2 bg-yellow-500 text-black rounded-md'
            >
              Update
            </button>
          </div>
        </PopupModal>
      )}
    </div>
  );
}
