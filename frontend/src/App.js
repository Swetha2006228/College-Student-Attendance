import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

import AddTeacherPage from "./pages/AddTeacherPage";
import ClassPage from "./pages/ClassPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        
        <Route path='/add-teacher' element={<AddTeacherPage />} />
        <Route path='/class' element={<ClassPage />} />
      </Routes>
    </Router>
  );
}

export default App;
