// pages/adminPages/ExamList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamList = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const res = await axios.get("/api/exams");
      setExams(res.data);
    };
    fetchExams();
  }, []);

  return (
    <div className="container">
      <h2>Danh sách đề đã tạo</h2>
      {exams.map((exam) => (
        <div key={exam._id} className="card my-2 p-3">
          <h4>{exam.title}</h4>
          <p>Chuyên mục: {exam.category}</p>
          <p>Số câu hỏi: {exam.questions.length}</p>
        </div>
      ))}
    </div>
  );
};

export default ExamList;
