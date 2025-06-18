import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button, Form } from "react-bootstrap";
import Layout from "../layout/Layout";
import API from "../../../../services/api";

function HistoryDetail() {
  const { id } = useParams(); // id của bài làm
  const [history, setHistory] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await API.get(`/exam-history/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy chi tiết bài làm:", err);
        alert("Không thể tải chi tiết bài làm.");
      }
    };

    fetchDetail();
  }, [id, token]);

  if (!history) {
    return <div className="text-center mt-5">Đang tải chi tiết bài làm...</div>;
  }

  const { examId, questions = [], score, passed } = history;

  return (
    <Layout>
      <Container className="mt-4">
        <Button variant="secondary" onClick={() => navigate("/profile")}>
          ⬅️ Quay lại hồ sơ
        </Button>

        <h3 className="text-center mt-3">{examId?.title || "Đề thi"}</h3>
        <p className="text-center text-muted">
          Bạn làm đúng {score}/{questions.length} câu -{" "}
          {passed ? "✅ Đạt" : "❌ Không đạt"}
        </p>

        {questions.map((q, index) => {
          const selected = q.selectedAnswerIndex;
          const correct = q.correctAnswerIndex;
          const question = q.questionId;

          return (
            <Card className="mb-4" key={q._id || index}>
              <Card.Body>
                <Card.Title style={{ color: "blue" }}>
                  Câu {index + 1}: {question?.content}
                </Card.Title>

                {question?.image && (
                  <img
                    src={question.image}
                    alt="Hình minh họa"
                    className="img-fluid mb-3"
                  />
                )}

                <Form>
                  {question?.answers?.map((a, idx) => {
                    const isSelected = idx === selected;
                    const isCorrect = idx === correct;

                    let variant = "light";
                    if (isCorrect) variant = "success";
                    else if (isSelected && !isCorrect) variant = "danger";

                    return (
                      <Form.Check
                        key={idx}
                        type="radio"
                        label={`${idx + 1}. ${a.text}`}
                        checked={isSelected}
                        disabled
                        style={{
                          backgroundColor:
                            variant === "success"
                              ? "#d4edda"
                              : variant === "danger"
                              ? "#f8d7da"
                              : undefined,
                          padding: "8px",
                          borderRadius: "4px",
                          marginBottom: "4px",
                        }}
                      />
                    );
                  })}
                </Form>
              </Card.Body>
            </Card>
          );
        })}
      </Container>
    </Layout>
  );
}

export default HistoryDetail;
