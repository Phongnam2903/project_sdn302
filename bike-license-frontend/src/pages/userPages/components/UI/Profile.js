import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Modal, ProgressBar } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  LogOut,
  ArrowLeft,
  BookOpen,
  Trophy,
  Calendar,
  Eye,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"
import Layout from "../layout/Layout"
import API from "../../../../services/api"
import "../../style/Profile.css"

function Profile() {
  const navigate = useNavigate()
  const [histories, setHistories] = useState([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [stats, setStats] = useState({
    totalExams: 0,
    passedExams: 0,
    averageScore: 0,
    bestScore: 0,
  })

  const token = localStorage.getItem("token")
  const name = localStorage.getItem("name")
  const email = localStorage.getItem("email")

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchExamHistories()
    }
  }, [token])

  const fetchExamHistories = async () => {
    try {
      const res = await API.get("/exam-history/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = res.data
      setHistories(data)

      // Calculate stats
      const totalExams = data.length
      const passedExams = data.filter((h) => h.passed).length
      const scores = data.map((h) => h.score)
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0

      setStats({
        totalExams,
        passedExams,
        averageScore,
        bestScore,
      })
    } catch (err) {
      console.error("❌ Lỗi lấy lịch sử bài làm:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    localStorage.removeItem("email")
    navigate("/login")
  }

  const getScoreColor = (score, total = 25) => {
    const percentage = (score / total) * 100
    if (percentage >= 84) return "success" // 21/25 = 84%
    if (percentage >= 70) return "warning"
    return "danger"
  }

  const getPassRate = () => {
    if (stats.totalExams === 0) return 0
    return Math.round((stats.passedExams / stats.totalExams) * 100)
  }

  return (
    <Layout>
      <Container className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <Button variant="outline-secondary" className="back-button" onClick={() => navigate("/")}>
            <ArrowLeft size={16} className="me-1" />
            Quay lại trang chủ
          </Button>

          <div className="profile-title-section">
            <div className="profile-icon">
              <User size={32} />
            </div>
            <h1 className="profile-title">Hồ Sơ Cá Nhân</h1>
            <p className="profile-subtitle">Quản lý thông tin và theo dõi kết quả học tập</p>
          </div>
        </div>

        <Row className="g-4">
          {/* Left Column - User Info & Stats */}
          <Col lg={4}>
            {/* User Info Card */}
            <Card className="profile-card user-info-card">
              <div className="card-header-gradient bg-primary">
                <div className="user-avatar">
                  <User size={40} />
                </div>
                <h5 className="text-white mb-0">Thông Tin Cá Nhân</h5>
              </div>
              <Card.Body className="p-4">
                <div className="user-detail">
                  <div className="detail-item">
                    <User className="detail-icon text-primary" size={18} />
                    <div className="detail-content">
                      <label>Họ và tên</label>
                      <span>{name}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Mail className="detail-icon text-success" size={18} />
                    <div className="detail-content">
                      <label>Email</label>
                      <span>{email}</span>
                    </div>
                  </div>
                </div>

                <Button variant="danger" className="logout-button w-100 mt-4" onClick={() => setShowLogoutModal(true)}>
                  <LogOut size={16} className="me-2" />
                  Đăng xuất
                </Button>
              </Card.Body>
            </Card>

            {/* Stats Cards */}
            <div className="stats-grid">
              <Card className="stat-card stat-primary">
                <Card.Body className="text-center">
                  <BookOpen className="stat-icon" size={24} />
                  <div className="stat-number">{stats.totalExams}</div>
                  <div className="stat-label">Bài thi đã làm</div>
                </Card.Body>
              </Card>

              <Card className="stat-card stat-success">
                <Card.Body className="text-center">
                  <Trophy className="stat-icon" size={24} />
                  <div className="stat-number">{stats.passedExams}</div>
                  <div className="stat-label">Bài thi đạt</div>
                </Card.Body>
              </Card>

              <Card className="stat-card stat-warning">
                <Card.Body className="text-center">
                  <BarChart3 className="stat-icon" size={24} />
                  <div className="stat-number">{stats.averageScore}</div>
                  <div className="stat-label">Điểm trung bình</div>
                </Card.Body>
              </Card>

              <Card className="stat-card stat-info">
                <Card.Body className="text-center">
                  <Award className="stat-icon" size={24} />
                  <div className="stat-number">{stats.bestScore}</div>
                  <div className="stat-label">Điểm cao nhất</div>
                </Card.Body>
              </Card>
            </div>

            {/* Progress Card */}
            <Card className="profile-card progress-card">
              <Card.Header className="bg-gradient-info text-white">
                <TrendingUp size={20} className="me-2" />
                Tiến Độ Học Tập
              </Card.Header>
              <Card.Body>
                <div className="progress-item">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tỷ lệ đậu</span>
                    <span className="fw-bold">{getPassRate()}%</span>
                  </div>
                  <ProgressBar
                    variant={getPassRate() >= 80 ? "success" : getPassRate() >= 60 ? "warning" : "danger"}
                    now={getPassRate()}
                    className="custom-progress"
                  />
                </div>

                <div className="progress-item mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Điểm trung bình</span>
                    <span className="fw-bold">{stats.averageScore}/25</span>
                  </div>
                  <ProgressBar
                    variant={getScoreColor(stats.averageScore)}
                    now={(stats.averageScore / 25) * 100}
                    className="custom-progress"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Exam History */}
          <Col lg={8}>
            <Card className="profile-card history-card">
              <div className="card-header-gradient bg-info">
                <div className="d-flex align-items-center">
                  <Clock size={24} className="me-2" />
                  <div>
                    <h5 className="text-white mb-0">Lịch Sử Bài Làm</h5>
                    <small className="text-white-50">Theo dõi kết quả các bài thi đã thực hiện</small>
                  </div>
                </div>
              </div>
              <Card.Body className="p-0">
                {histories.length === 0 ? (
                  <div className="empty-state">
                    <BookOpen size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">Chưa có bài làm nào</h6>
                    <p className="text-muted mb-4">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
                    <Button variant="primary" onClick={() => navigate("/")}>
                      Bắt đầu làm bài
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="history-table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Tên đề thi</th>
                          <th>Điểm số</th>
                          <th>Kết quả</th>
                          <th>Ngày làm</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {histories.map((h, index) => (
                          <tr key={h._id} className="history-row">
                            <td className="text-center fw-bold">{index + 1}</td>
                            <td>
                              <div className="exam-title">
                                <BookOpen size={16} className="me-2 text-primary" />
                                {h.examId?.title || "Không rõ"}
                              </div>
                            </td>
                            <td>
                              <Badge bg={getScoreColor(h.score)} className="score-badge">
                                {h.score}/25
                              </Badge>
                            </td>
                            <td>
                              {h.passed ? (
                                <Badge bg="success" className="result-badge">
                                  <CheckCircle size={14} className="me-1" />
                                  Đạt
                                </Badge>
                              ) : (
                                <Badge bg="danger" className="result-badge">
                                  <XCircle size={14} className="me-1" />
                                  Không đạt
                                </Badge>
                              )}
                            </td>
                            <td className="text-muted">
                              <Calendar size={14} className="me-1" />
                              {new Date(h.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="detail-button"
                                onClick={() => navigate(`/history/${h._id}`)}
                              >
                                <Eye size={14} className="me-1" />
                                Chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Logout Confirmation Modal */}
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered className="logout-modal">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="d-flex align-items-center">
              <LogOut className="me-2 text-danger" size={24} />
              Xác nhận đăng xuất
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <p className="mb-4">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="outline-secondary" onClick={() => setShowLogoutModal(false)}>
                Hủy bỏ
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                <LogOut size={16} className="me-1" />
                Đăng xuất
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  )
}

export default Profile
