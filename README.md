# 🎓 Student Attendance Management System

<div align="center">

A full-stack **College Management System** built with the **MERN Stack** — featuring role-based access control, JWT authentication, and a clean dark UI for managing classes, students, and daily attendance.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

</div>

---

##  Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Improvements](#-future-improvements)

---

##  About

The **Student Attendance Management System** is a web-based platform that digitizes and streamlines the attendance process in colleges. It eliminates paper-based registers and manual tracking by providing a centralized system where teachers can manage classes, students, and daily attendance — all secured with role-based authentication.

Two user roles exist — **Super Admin** and **Teacher** — each with their own level of access and responsibility.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Token) |
| Password Security | bcrypt |
| Validation | Joi |
| Module System | ES Modules (import/export) |

---

##  Features

###  Authentication System
- Separate login for **Super Admin** and **Teacher**
- JWT-based secure authentication
- Password hashing with **bcrypt**
- Password show/hide toggle on login screen

###  Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Super Admin** | Add and manage teacher accounts |
| **Teacher** | Manage classes, students, and attendance |

###  Class Management
- Create a class with **classname**, **section**, and **year**
- Unique constraint enforced on `year + classname + section` combination
- Filter and view classes by year

###  Student Management
- Add students to a specific class
- Edit student name
- Delete student
- Fetch student list filtered by class

###  Attendance Management
- Mark attendance as **Present** or **Absent** per student
- Attendance stored per class per date
- **Cannot edit past attendance** — data integrity protected
- Auto-fetch attendance by selected date

###  UI Features
- Clean **dark UI** built with Tailwind CSS
- Popup modals for all forms
- Navbar showing logged-in username
- Logout dropdown
- Interactive toggle buttons for marking attendance

---

##  Project Structure

```
attendance-management-system/
│
├── backend/
│   ├── config/              # DB connection setup
│   ├── controllers/         # Route logic
│   │   ├── authController.js
│   │   ├── teacherController.js
│   │   ├── classController.js
│   │   ├── studentController.js
│   │   └── attendanceController.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Teacher.js
│   │   ├── Class.js
│   │   ├── Student.js
│   │   └── Attendance.js
│   ├── routes/              # Express route definitions
│   ├── middlewares/         # JWT auth middleware
│   ├── validations/         # Joi validation schemas
│   ├── .env                 # Environment variables (gitignored)
│   └── server.js
│
└── frontend/
    ├── components/          # Reusable UI components
    ├── pages/               # Page-level components
    ├── App.js
    └── index.js
```

---

##  Database Models

###  User (Super Admin)
```js
{ username, password, role: "superadmin" }
```

###  Teacher
```js
{ name, username, password, role: "teacher" }
```

###  Class
```js
{ classname, section, year }
// Unique constraint: year + classname + section
```

###  Student
```js
{ name, classid }
```

###  Attendance
```js
{
  classid,
  date,
  records: [
    { studentid, status }   // status: "Present" | "Absent"
  ]
}
```

---

##  API Endpoints

###  Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Login for Super Admin or Teacher | Public |

###  Teacher
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/add-teacher` | Add a new teacher | Super Admin |

###  Class
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/create-class` | Create a new class | Teacher |
| `GET` | `/get-allyear` | Get all available years | Teacher |
| `GET` | `/get-allsection` | Get all sections | Teacher |
| `GET` | `/get-classes-by-year` | Get classes filtered by year | Teacher |
| `DELETE` | `/delete-class` | Delete a class | Teacher |

###  Student
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/student/create` | Add a student to a class | Teacher |
| `GET` | `/api/student/student-list` | Get students by class | Teacher |
| `PUT` | `/api/student/edit-studentname` | Edit student name | Teacher |
| `DELETE` | `/api/student/deletestudent` | Delete a student | Teacher |

###  Attendance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/attendance/mark` | Mark attendance for a date | Teacher |
| `GET` | `/api/attendance/get` | Get attendance by class and date | Teacher |

---

##  Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/student-attendance-system.git
cd student-attendance-system
```

### 2. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/attendancedb
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
PORT=3000
```

### 3. Run the Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Run the Frontend

```bash
cd frontend
npm install
npm start
```

### 5. Open in browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |

---

##  Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`) |
| `PORT` | Port for the backend server |



---

##  Future Improvements

-  Attendance analytics dashboard with charts
-  Export attendance reports as PDF or Excel
-  Add student profile photos
-  Implement refresh tokens for better session management
-  Mobile responsive improvements
-  Notify teachers for low attendance students

---

