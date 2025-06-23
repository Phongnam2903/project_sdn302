import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Row, Col, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../services/api";
import Layout from "../layout/Layout";

const TOTAL_TIME = 19 * 60;

function UserExam() {
  const [exam, setExam] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);

  const { id: examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để làm bài thi");
        navigate("/login");
        return;
      }

      if (!examId) {
        alert("Không tìm thấy ID đề thi");
        return;
      }

      try {
        const res = await API.get(`/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || !res.data.questions) {
          throw new Error(
            "Không tìm thấy dữ liệu đề thi hoặc danh sách câu hỏi"
          );
        }

        setExam(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch đề thi:", error);
        alert(
          "Lỗi tải đề thi: " + (error.response?.data?.error || error.message)
        );
      }
    };

    fetchExam();
  }, [examId, navigate]);

  const submitResult = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/exam-history",
        {
          examId: exam._id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("📦 Lưu kết quả thành công:", res.data);
    } catch (error) {
      console.error("Lỗi khi gửi kết quả:", error);
    }
  }, [exam?._id, answers]);

  const finishExam = useCallback(async () => {
    setFinished(true);
    await submitResult();
  }, [submitResult]);

  useEffect(() => {
    if (!exam || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, finished, finishExam]);

  const handleSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getScore = () => {
    if (!exam?.questions) return 0;
    let correct = 0;
    exam.questions.forEach((q) => {
      const selected = answers[q._id];
      if (selected !== undefined && q.answers[selected]?.isCorrect) {
        correct++;
      }
    });
    return correct;
  };

  if (!exam) return <div className="text-center mt-4">Đang tải đề thi...</div>;
  if (!exam.questions || exam.questions.length === 0)
    return (
      <div className="text-center mt-4 text-danger">
        ❌ Không có câu hỏi nào trong đề thi
      </div>
    );

  const question = exam.questions[current];

  return (
    <Layout>
      <h2 className="text-center text-uppercase my-4 text-primary fw-bold">
        Bài thi trắc nghiệm
      </h2>

      <div className="text-left m-3">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ⬅️ Quay lại trang chủ
        </Button>
      </div>

      <h3 className="text-center text-uppercase m-3">
        {exam.title || "Đề thi"} - SỐ CÂU: {exam.questions.length} câu
      </h3>

      {finished && (
        <div className="alert alert-info text-center">
          ✅ Bạn làm đúng {getScore()} / {exam.questions.length} câu
        </div>
      )}

      <Row className="gx-4 gy-4 align-items-stretch">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <h5 style={{ color: "blue" }}>Danh sách câu hỏi</h5>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {exam.questions.map((q, idx) => (
                  <Button
                    key={q._id}
                    variant={
                      answers[q._id] !== undefined
                        ? "success"
                        : finished
                        ? "secondary"
                        : "outline-success"
                    }
                    className="btn-sm text-center p-2 fw-bold"
                    style={{
                      width: "48px",
                      height: "48px",
                      lineHeight: "32px",
                    }}
                    onClick={() => setCurrent(idx)}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong style={{ color: "blue" }}>Câu {current + 1}</strong>
                <strong style={{ color: "red" }}>{formatTime(timeLeft)}</strong>
              </div>

              {/* Thanh tiến trình */}
              <div className="mb-3">
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                      width: `${(timeLeft / TOTAL_TIME) * 100}%`,
                      transition: "width 1s linear",
                    }}
                    aria-valuenow={(timeLeft / TOTAL_TIME) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>

              <div className="mb-3">{question.content}</div>

              {question.image && (
                <img
                  src={question.image}
                  alt="Hình minh họa"
                  className="img-fluid mb-3"
                />
              )}

              <Form className="mb-3">
                {question.answers.map((a, idx) => {
                  const selected = answers[question._id];
                  const isChecked = selected === idx;

                  return (
                    <Form.Check
                      key={idx}
                      type="radio"
                      name={`q_${question._id}`}
                      label={`${idx + 1}. ${a.text}`}
                      checked={isChecked}
                      disabled={finished}
                      onChange={() => handleSelect(question._id, idx)}
                    />
                  );
                })}
              </Form>

              <div className="d-flex justify-content-between mt-auto">
                <Button
                  variant="outline-primary"
                  onClick={() => setCurrent(current - 1)}
                  disabled={current === 0}
                >
                  Câu trước
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => setCurrent(current + 1)}
                  disabled={current === exam.questions.length - 1}
                >
                  Câu tiếp theo
                </Button>
              </div>

              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={finishExam}
                  disabled={finished}
                >
                  KẾT THÚC BÀI THI
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default UserExam;
