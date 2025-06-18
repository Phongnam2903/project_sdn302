import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/userPages/Home";
import Practice from "./pages/Practice";

import History from "./pages/History";
import Admin from "./pages/adminPages/Admin";
import Login from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";
import RandomExamCreate from "./pages/adminPages/components/RandomExamCreate";
import ExamList from "./pages/adminPages/components/ExamList";
import UserExam from "./pages/userPages/components/UI/UserExam";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/create-exam" element={<RandomExamCreate />} />
        <Route path="/admin/exams" element={<ExamList />} />

        <Route path="/user/exam/:id" element={<UserExam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
