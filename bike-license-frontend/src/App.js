import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/userPages/Home";
import Practice from "./pages/Practice";
import Exam from "./pages/Exam";
import History from "./pages/History";
import Admin from "./pages/adminPages/Admin";
import Login from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
