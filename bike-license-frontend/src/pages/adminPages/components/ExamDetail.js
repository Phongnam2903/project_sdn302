import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  ListGroup,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import API from "../../../services/api";

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await API.get(`/exams/${id}`);
      setExam(res.data);
    };
    fetchExam();
  }, [id]);

  if (!exam)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <div>Đang tải đề thi...</div>
      </Container>
    );

  return (
    <Container className="mt-4">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/admin")}
      >
        🔙 Quay lại trang chủ
      </Button>

      <h2 className="mb-2">{exam.title}</h2>
      <p>
        <strong>Chuyên mục:</strong> {exam.category}
      </p>

      <h4 className="mt-4">📋 Danh sách câu hỏi</h4>
      <ListGroup variant="flush">
        {exam.questions.map((q, idx) => (
          <ListGroup.Item key={q._id} className="mb-3 shadow-sm rounded">
            <p>
              <strong>Câu {idx + 1}:</strong> {q.content}
            </p>

            <ListGroup variant="flush">
              {q.answers.map((ans, i) => (
                <ListGroup.Item
                  key={i}
                  className="ps-4"
                  style={{
                    fontWeight: ans.isCorrect ? "bold" : "normal",
                    color: ans.isCorrect ? "green" : "inherit",
                    backgroundColor: ans.isCorrect ? "#f0fff4" : "transparent",
                  }}
                >
                  {String.fromCharCode(65 + i)}. {ans.text}
                  {ans.isCorrect && " ✅"}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ExamDetail;
