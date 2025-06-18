import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../services/api";

const ExamDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await API.get(`/exams/${id}`);
      setExam(res.data);
    };
    fetchExam();
  }, [id]);

  if (!exam) return <p>Đang tải...</p>;

  return (
    <div className="container">
      <h2>{exam.title}</h2>
      <p>
        <strong>Chuyên mục:</strong> {exam.category}
      </p>
      <h4>Danh sách câu hỏi:</h4>
      <ul>
        {exam.questions.map((q, idx) => (
          <li key={q._id}>
            <strong>Câu {idx + 1}:</strong> {q.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamDetail;
