import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/userPages/Home";
import Admin from "./pages/adminPages/Admin";
import Login from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";
import RandomExamCreate from "./pages/adminPages/components/RandomExamCreate";
import ExamList from "./pages/adminPages/components/ExamList";
import UserExam from "./pages/userPages/components/UI/UserExam";
import Profile from "./pages/userPages/components/UI/Profile";
import HistoryDetail from "./pages/userPages/components/UI/HistoryDetails";
import ExamDetail from "./pages/adminPages/components/ExamDetail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/create-exam" element={<RandomExamCreate />} />
        <Route path="/admin/exams" element={<ExamList />} />
        <Route path="/user/exam/:id" element={<UserExam />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="/exams/:id" element={<ExamDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
