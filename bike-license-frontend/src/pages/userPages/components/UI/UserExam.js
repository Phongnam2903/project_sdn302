import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Toast,
  ToastContainer,
  Modal,
  ProgressBar,
  Badge,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Eye,
  Target,
} from "lucide-react";
import API from "../../../../services/api";
import Layout from "../layout/Layout";
import "../../style/UserExam.css";

const TOTAL_TIME = 19 * 60;

function UserExam() {
  const [exam, setExam] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [showToast, setShowToast] = useState(false);
  const [toastStartTime, setToastStartTime] = useState(null);
  const toastDuration = 3000;

  const { id: examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowToast(true);
        const start = Date.now();
        setToastStartTime(start);

        const timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const newProgress = Math.max(
            0,
            100 - (elapsed / toastDuration) * 100
          );
          setProgress(newProgress);

          if (elapsed >= toastDuration) {
            clearInterval(timer);
            navigate("/login");
          }
        }, 50);

        return;
      }

      if (!examId) {
        alert("Không tìm thấy ID đề thi");
        return;
      }

      const submittedKey = `exam_${examId}_submitted`;
      const isSubmitted = localStorage.getItem(submittedKey) === "true";
      if (isSubmitted) {
        setFinished(true);
        setIsPaused(true);
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

  const hasFailedCriticalQuestion = () => {
    if (!exam?.questions) return false;

    return exam.questions.some((q) => {
      if (q.category !== "Điểm Liệt") return false;
      const selected = answers[q._id];
      return selected === undefined || !q.answers[selected]?.isCorrect;
    });
  };

  const submitResult = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
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
    } catch (error) {
      console.error("Lỗi khi gửi kết quả:", error);
    }
  }, [exam?._id, answers]);

  const finishExam = useCallback(async () => {
    setFinished(true);
    setIsPaused(true);

    localStorage.setItem(`exam_${exam?._id}_submitted`, "true");

    await submitResult();
  }, [submitResult, exam?._id]);

  useEffect(() => {
    if (!exam || finished || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }

        // Show warning when 5 minutes left
        if (prev === 5 * 60 && !showTimeWarning) {
          setShowTimeWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, finished, isPaused, finishExam, showTimeWarning]);

  const handleSelect = (questionId, answerIndex) => {
    if (finished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getScore = () => {
    if (!exam?.questions) return 0;
    return exam.questions.reduce((acc, q) => {
      const selected = answers[q._id];
      return selected !== undefined && q.answers[selected]?.isCorrect
        ? acc + 1
        : acc;
    }, 0);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / TOTAL_TIME) * 100;
    if (percentage > 50) return "success";
    if (percentage > 25) return "warning";
    return "danger";
  };

  const getProgressPercentage = () => {
    if (!exam?.questions) return 0;
    return Math.round((getAnsweredCount() / exam.questions.length) * 100);
  };

  const handleSubmitConfirm = () => {
    setShowSubmitModal(false);
    finishExam();
  };

  const goToQuestion = (index) => {
    setCurrent(index);
  };

  const isPassed = getScore() >= 21 && !hasFailedCriticalQuestion();
  const nextQuestion = () => {
    if (current < exam.questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  if (showToast) {
    return (
      <Layout>
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 9999 }}
        >
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            autohide
            delay={3000}
            bg="light"
            className="auth-toast"
          >
            <div
              className="toast-progress-bar"
              style={{ width: `${progress}%` }}
            />
            <Toast.Header closeButton>
              <AlertTriangle className="me-2 text-warning" size={18} />
              <strong className="me-auto text-warning">Thông báo</strong>
            </Toast.Header>
            <Toast.Body className="fw-semibold text-dark text-center">
              Vui lòng đăng nhập để làm bài thi.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <div className="exam-loading">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <div className="loading-text">Đang tải đề thi...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!exam.questions || exam.questions.length === 0) {
    return (
      <Layout>
        <div className="exam-error">
          <AlertTriangle size={48} className="text-danger mb-3" />
          <h5>Không có câu hỏi nào trong đề thi</h5>
          <Button variant="primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="exam-container">
        {/* Header */}
        <div className="exam-header">
          <Button
            variant="outline-secondary"
            className="back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} className="me-1" />
            Trang chủ
          </Button>

          <div className="exam-title-section">
            <div className="exam-icon">
              <BookOpen size={32} />
            </div>
            <h1 className="exam-title">{exam.title || "Đề thi"}</h1>
            <p className="exam-subtitle">
              <Target className="me-1" size={16} />
              {exam.questions.length} câu hỏi - Thời gian: 19 phút
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="progress-card">
          <Card.Body className="p-3">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="time-display">
                  <Clock
                    className={`time-icon text-${getTimeColor()}`}
                    size={20}
                  />
                  <div className="time-info">
                    <div className={`time-value text-${getTimeColor()}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <small className="time-label">Thời gian còn lại</small>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="progress-section">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="progress-label">Tiến độ làm bài</span>
                    <span className="progress-value">
                      {getAnsweredCount()}/{exam.questions.length} câu
                    </span>
                  </div>
                  <ProgressBar className="custom-progress">
                    <ProgressBar
                      variant="success"
                      now={getProgressPercentage()}
                      key={1}
                      className="progress-answered"
                    />
                    <ProgressBar
                      variant="danger"
                      now={(timeLeft / TOTAL_TIME) * 100}
                      key={2}
                      className="progress-time"
                      style={{
                        position: "absolute",
                        top: 0,
                        height: "4px",
                        opacity: 0.7,
                      }}
                    />
                  </ProgressBar>
                </div>
              </Col>
              <Col md={3}>
                <div className="stats-display">
                  <div className="stat-item">
                    <CheckCircle className="stat-icon text-success" size={16} />
                    <span>{getAnsweredCount()} đã làm</span>
                  </div>
                  <div className="stat-item">
                    <AlertTriangle
                      className="stat-icon text-warning"
                      size={16}
                    />
                    <span>
                      {exam.questions.length - getAnsweredCount()} còn lại
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Time Warning Alert */}
        {showTimeWarning && timeLeft <= 5 * 60 && timeLeft > 0 && (
          <Alert
            variant="warning"
            className="time-warning-alert"
            dismissible
            onClose={() => setShowTimeWarning(false)}
          >
            <AlertTriangle className="me-2" size={16} />
            <strong>Cảnh báo:</strong> Chỉ còn {Math.ceil(timeLeft / 60)} phút!
            Hãy hoàn thành bài thi.
          </Alert>
        )}

        {/* Result Display */}
        {finished && (
          <Alert
            variant={isPassed ? "success" : "danger"}
            className="result-alert"
          >
            <div className="result-content">
              <div className="result-icon">
                {isPassed ? (
                  <CheckCircle size={32} className="text-success" />
                ) : (
                  <AlertTriangle size={32} className="text-danger" />
                )}
              </div>
              <div className="result-info">
                <h5 className="mb-1">
                  {isPassed
                    ? "🎉 Chúc mừng! Bạn đã đạt"
                    : "😔 Rất tiếc! Bạn chưa đạt"}
                </h5>
                <p className="mb-0">
                  Điểm số:
                  <strong>
                    {getScore()}/{exam.questions.length}
                  </strong>
                  -{" "}
                  <strong>
                    {Math.round((getScore() / exam.questions.length) * 100)}%
                  </strong>
                </p>
                {!isPassed && hasFailedCriticalQuestion() && (
                  <p className="text-danger mt-2">
                    ❌ Bạn đã làm sai ít nhất một câu hỏi{" "}
                    <strong>Điểm Liệt</strong>. Bài thi không đạt yêu cầu.
                  </p>
                )}
              </div>
              <Button
                variant="primary"
                onClick={() => navigate("/profile")}
                className="result-button"
              >
                <Eye size={16} className="me-1" />
                Xem chi tiết
              </Button>
            </div>
          </Alert>
        )}

        <Row className="exam-content">
          <div className="question-separator">
            {/* Question Navigation */}
            <Col lg={3}>
              <Card className="navigation-card sticky-top">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">
                    <Flag className="me-2" size={16} />
                    Danh sách câu hỏi
                  </h6>
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="question-grid">
                    {exam.questions.map((q, idx) => {
                      const isAnswered = answers[q._id] !== undefined;
                      const isCurrent = idx === current;

                      return (
                        <Button
                          key={q._id}
                          variant={
                            isCurrent
                              ? "primary"
                              : isAnswered
                              ? "success"
                              : "outline-secondary"
                          }
                          className={`question-nav-btn ${
                            isCurrent ? "current" : ""
                          } ${isAnswered ? "answered" : ""}`}
                          onClick={() => goToQuestion(idx)}
                          disabled={finished && !isAnswered}
                        >
                          {idx + 1}
                          {isAnswered && (
                            <CheckCircle className="check-icon" size={12} />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="navigation-legend mt-3">
                    <div className="legend-item">
                      <div className="legend-color bg-success"></div>
                      <small>Đã làm</small>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color bg-primary"></div>
                      <small>Hiện tại</small>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color bg-light border"></div>
                      <small>Chưa làm</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Question Content */}
            <Col lg={9}>
              <Card className="question-card">
                <Card.Header className="question-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="question-info">
                      <Badge bg="primary" className="question-badge">
                        Câu {current + 1}/{exam.questions.length}
                      </Badge>
                      {answers[exam.questions[current]._id] !== undefined && (
                        <Badge bg="success" className="ms-2">
                          <CheckCircle size={12} className="me-1" />
                          Đã trả lời
                        </Badge>
                      )}
                    </div>
                    <div className="question-timer">
                      <Clock
                        className={`me-1 text-${getTimeColor()}`}
                        size={16}
                      />
                      <span className={`fw-bold text-${getTimeColor()}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="question-body">
                  <div className="question-content">
                    <h5 className="question-text">
                      {exam.questions[current].content}
                    </h5>

                    {exam.questions[current].image && (
                      <div className="question-image">
                        <img
                          src={`http://localhost:5000${exam.questions[current].image}`}
                          alt="Ảnh câu hỏi"
                          className="img-fluid rounded shadow-sm"
                        />
                      </div>
                    )}

                    <Form className="answers-form">
                      {exam.questions[current].answers.map((a, idx) => (
                        <div key={idx} className="answer-option">
                          <Form.Check
                            type="radio"
                            name={`q_${exam.questions[current]._id}`}
                            id={`answer_${idx}`}
                            label={
                              <div className="answer-content">
                                <span className="answer-letter">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="answer-text">{a.text}</span>
                              </div>
                            }
                            checked={
                              answers[exam.questions[current]._id] === idx
                            }
                            disabled={finished}
                            onChange={() =>
                              handleSelect(exam.questions[current]._id, idx)
                            }
                            className="answer-radio"
                          />
                        </div>
                      ))}
                    </Form>
                  </div>

                  <div className="question-actions">
                    <div className="navigation-buttons">
                      <Button
                        variant="outline-secondary"
                        onClick={prevQuestion}
                        disabled={current === 0 || finished}
                        className="nav-button"
                      >
                        <ArrowLeft size={16} className="me-1" />
                        Câu trước
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={nextQuestion}
                        disabled={
                          current === exam.questions.length - 1 || finished
                        }
                        className="nav-button"
                      >
                        Câu tiếp
                        <ArrowRight size={16} className="ms-1" />
                      </Button>
                    </div>

                    <Button
                      variant="danger"
                      size="lg"
                      onClick={() => setShowSubmitModal(true)}
                      disabled={finished}
                      className="submit-button"
                    >
                      <Flag size={16} className="me-2" />
                      Nộp bài thi
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </div>
        </Row>

        {/* Submit Confirmation Modal */}
        <Modal
          show={showSubmitModal}
          onHide={() => setShowSubmitModal(false)}
          centered
          className="submit-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="d-flex align-items-center">
              <Flag className="me-2 text-danger" size={24} />
              Xác nhận nộp bài
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="submit-summary">
              <div className="summary-item">
                <CheckCircle className="summary-icon text-success" size={20} />
                <span>
                  Đã làm: <strong>{getAnsweredCount()}</strong> câu
                </span>
              </div>
              <div className="summary-item">
                <AlertTriangle
                  className="summary-icon text-warning"
                  size={20}
                />
                <span>
                  Chưa làm:{" "}
                  <strong>{exam.questions.length - getAnsweredCount()}</strong>{" "}
                  câu
                </span>
              </div>
              <div className="summary-item">
                <Clock className="summary-icon text-info" size={20} />
                <span>
                  Thời gian còn lại: <strong>{formatTime(timeLeft)}</strong>
                </span>
              </div>
            </div>
            <p className="mt-3 text-muted">
              Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác.
            </p>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setShowSubmitModal(false)}
              >
                Tiếp tục làm bài
              </Button>
              <Button variant="danger" onClick={handleSubmitConfirm}>
                <Flag size={16} className="me-1" />
                Nộp bài ngay
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
}

export default UserExam;
