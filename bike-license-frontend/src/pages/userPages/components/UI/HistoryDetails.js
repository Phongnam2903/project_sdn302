import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Container, Button, Form, Badge, Row, Col, ProgressBar } from "react-bootstrap"
import { ArrowLeft, CheckCircle, XCircle, Clock, BookOpen, Award, AlertTriangle, Eye } from "lucide-react"
import Layout from "../layout/Layout"
import API from "../../../../services/api"
import "../../style/HistoryDetails.css"

function HistoryDetail() {
  const { id } = useParams()
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/exam-history/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setHistory(res.data)
      } catch (err) {
        console.error("❌ Lỗi lấy chi tiết bài làm:", err)
        alert("Không thể tải chi tiết bài làm.")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, token])

  if (loading) {
    return (
      <Layout>
        <Container className="text-center mt-5">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <div className="mt-3">Đang tải chi tiết bài làm...</div>
          </div>
        </Container>
      </Layout>
    )
  }

  if (!history) {
    return (
      <Layout>
        <Container className="text-center mt-5">
          <div className="error-state">
            <XCircle size={48} className="text-danger mb-3" />
            <h5>Không tìm thấy bài làm</h5>
            <Button variant="primary" onClick={() => navigate("/profile")}>
              Quay lại hồ sơ
            </Button>
          </div>
        </Container>
      </Layout>
    )
  }

  const { examId, questions = [], score, passed } = history
  const totalQuestions = questions.length
  const correctAnswers = score
  const wrongAnswers = totalQuestions - correctAnswers
  const scorePercentage = Math.round((score / totalQuestions) * 100)

  return (
    <Layout>
      <Container className="history-detail-container">
        {/* Header */}
        <div className="detail-header">
          <Button variant="outline-secondary" className="back-button" onClick={() => navigate("/profile")}>
            <ArrowLeft size={16} className="me-1" />
            Quay lại hồ sơ
          </Button>

          <div className="detail-title-section">
            <div className="detail-icon">
              <Eye size={32} />
            </div>
            <h1 className="detail-title">Chi Tiết Bài Làm</h1>
            <p className="detail-subtitle">Xem lại kết quả và đáp án chi tiết</p>
          </div>
        </div>

        {/* Result Summary */}
        <Card className="result-summary-card">
          <div className={`card-header-gradient ${passed ? "bg-success" : "bg-danger"}`}>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center">
                  <BookOpen size={24} className="me-3" />
                  <div>
                    <h4 className="text-white mb-1">{examId?.title || "Đề thi"}</h4>
                    <p className="text-white-50 mb-0">
                      <Clock size={16} className="me-1" />
                      Làm bài ngày: {new Date(history.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div className="result-badge-large">
                  {passed ? (
                    <Badge bg="success" className="result-badge-xl">
                      <CheckCircle size={20} className="me-2" />
                      ĐẠT
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="result-badge-xl">
                      <XCircle size={20} className="me-2" />
                      KHÔNG ĐẠT
                    </Badge>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <Card.Body className="p-4">
            <Row className="g-4">
              <Col md={3}>
                <div className="score-stat">
                  <div className="score-number">{score}</div>
                  <div className="score-label">Câu đúng</div>
                  <div className="score-total">/ {totalQuestions}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="score-stat">
                  <div className="score-number text-danger">{wrongAnswers}</div>
                  <div className="score-label">Câu sai</div>
                  <div className="score-total">/ {totalQuestions}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="score-stat">
                  <div className="score-number text-info">{scorePercentage}%</div>
                  <div className="score-label">Tỷ lệ đúng</div>
                  <div className="score-total">Cần 84%</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="progress-section">
                  <div className="mb-2">
                    <small className="text-muted">Tiến độ hoàn thành</small>
                  </div>
                  <ProgressBar
                    variant={scorePercentage >= 84 ? "success" : scorePercentage >= 70 ? "warning" : "danger"}
                    now={scorePercentage}
                    className="custom-progress-lg"
                  />
                  <div className="text-center mt-1">
                    <small className="fw-bold">{scorePercentage}%</small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Questions Review */}
        <div className="questions-section">
          <h4 className="section-title mb-4">
            <BookOpen className="me-2" />
            Xem Lại Đáp Án Chi Tiết
          </h4>

          {questions.map((q, index) => {
            const selected = q.selectedAnswerIndex
            const correct = q.correctAnswerIndex
            const question = q.questionId
            const isCorrect = selected === correct

            return (
              <Card className={`question-card ${isCorrect ? "correct" : "incorrect"}`} key={q._id || index}>
                <Card.Body className="p-4">
                  <div className="question-header">
                    <div className="question-number">
                      <span>Câu {index + 1}</span>
                      {isCorrect ? (
                        <CheckCircle className="result-icon text-success" size={20} />
                      ) : (
                        <XCircle className="result-icon text-danger" size={20} />
                      )}
                    </div>
                    <Badge bg={isCorrect ? "success" : "danger"} className="result-badge-sm">
                      {isCorrect ? "Đúng" : "Sai"}
                    </Badge>
                  </div>

                  <div className="question-content">
                    <h6 className="question-text">{question?.content}</h6>

                    {question?.image && (
                      <div className="question-image">
                        <img
                          src={question.image || "/placeholder.svg"}
                          alt="Hình minh họa"
                          className="img-fluid rounded"
                        />
                      </div>
                    )}

                    <div className="answers-section">
                      {question?.answers?.map((a, idx) => {
                        const isSelected = idx === selected
                        const isCorrectAnswer = idx === correct

                        let answerClass = "answer-option"
                        if (isCorrectAnswer) answerClass += " correct-answer"
                        else if (isSelected && !isCorrectAnswer) answerClass += " wrong-answer"

                        return (
                          <div key={idx} className={answerClass}>
                            <Form.Check
                              type="radio"
                              label={`${String.fromCharCode(65 + idx)}. ${a.text}`}
                              checked={isSelected}
                              disabled
                              className="answer-radio"
                            />
                            <div className="answer-indicators">
                              {isCorrectAnswer && <CheckCircle className="text-success" size={16} />}
                              {isSelected && !isCorrectAnswer && <XCircle className="text-danger" size={16} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {!isCorrect && (
                      <div className="explanation-section">
                        <AlertTriangle className="me-2 text-warning" size={16} />
                        <small className="text-muted">
                          Đáp án đúng là: <strong>{String.fromCharCode(65 + correct)}</strong>
                        </small>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="action-section text-center">
          <Button variant="primary" size="lg" className="me-3" onClick={() => navigate("/")}>
            <BookOpen size={16} className="me-2" />
            Làm bài thi mới
          </Button>
          <Button variant="outline-secondary" size="lg" onClick={() => navigate("/profile")}>
            <Award size={16} className="me-2" />
            Xem tất cả kết quả
          </Button>
        </div>
      </Container>
    </Layout>
  )
}

export default HistoryDetail
