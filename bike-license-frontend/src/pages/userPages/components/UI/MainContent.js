import API from "../../../../services/api";
import { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Award,
} from "lucide-react";

function MainContent() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        setExams(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề thi:", error);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="main-content-wrapper">
      <Row className="g-4">
        {/* Left Column */}
        <Col lg={6}>
          <Card className="h-100 shadow-lg border-0 main-card">
            <div className="card-header-custom bg-gradient-success">
              <Card.Title className="text-white mb-0 d-flex align-items-center">
                <BookOpen className="me-2" size={24} />
                Phần Mềm Luyện Thi Lý Thuyết 250 Câu A1
              </Card.Title>
            </div>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <img
                  src="/images/thibanglaixemaya1.png"
                  alt="Thi bằng lái xe máy A1"
                  className="img-fluid rounded-3 shadow-sm"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </div>

              <div className="content-text">
                <p className="text-muted mb-3 lh-lg">
                  Phần mềm được phát triển dựa trên cấu trúc bộ đề thi sát hạch
                  lý thuyết lái xe mô tô hạng A1 do Bộ Công An ban hành quy định
                  trong kỳ thi sát hạch chính thức.
                </p>
                <p className="text-muted lh-lg">
                  Để tập phần thi lý thuyết bằng lái xe A1 tốt nhất, các học
                  viên có thể sử dụng trực tiếp 10 bộ đề thi này để luyện tập
                  hiệu quả.
                </p>
              </div>

              <div className="feature-highlights mt-4">
                <div className="d-flex align-items-center mb-2">
                  <CheckCircle className="text-success me-2" size={16} />
                  <small className="text-muted">
                    Cập nhật theo quy định mới nhất
                  </small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <CheckCircle className="text-success me-2" size={16} />
                  <small className="text-muted">
                    Giao diện thân thiện, dễ sử dụng
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <CheckCircle className="text-success me-2" size={16} />
                  <small className="text-muted">
                    Kết quả chi tiết sau mỗi bài thi
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={6}>
          <Card className="h-100 shadow-lg border-0 main-card">
            <div className="card-header-custom bg-gradient-primary">
              <Card.Title className="text-white mb-0 d-flex align-items-center">
                <Award className="me-2" size={24} />
                Bộ Đề Thi Thử Bằng Lái Xe Máy A1
              </Card.Title>
            </div>
            <Card.Body className="p-4">
              <Alert variant="info" className="border-0 bg-light-info">
                <AlertTriangle className="me-2" size={16} />
                <strong>Cấu trúc đề thi:</strong> Mỗi đề gồm{" "}
                <Badge bg="danger" className="mx-1">
                  25 câu hỏi
                </Badge>
                , chỉ có{" "}
                <Badge bg="warning" className="mx-1">
                  1 đáp án đúng
                </Badge>{" "}
                cho mỗi câu.
              </Alert>

              <div className="exam-info-grid mb-4">
                <Row className="g-3">
                  <Col sm={6}>
                    <div className="info-item p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <BookOpen className="text-primary me-2" size={20} />
                        <div>
                          <div className="fw-bold text-primary">25 Câu</div>
                          <small className="text-muted">Số lượng câu hỏi</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="info-item p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <CheckCircle className="text-success me-2" size={20} />
                        <div>
                          <div className="fw-bold text-success">21/25 Đúng</div>
                          <small className="text-muted">Yêu cầu đạt</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="info-item p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <Clock className="text-warning me-2" size={20} />
                        <div>
                          <div className="fw-bold text-warning">19 Phút</div>
                          <small className="text-muted">
                            Thời gian làm bài
                          </small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="info-item p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <AlertTriangle className="text-danger me-2" size={20} />
                        <div>
                          <div className="fw-bold text-danger">2-4 Câu</div>
                          <small className="text-muted">Câu điểm liệt</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Alert variant="danger" className="border-0 bg-light-danger">
                <AlertTriangle className="me-2" size={16} />
                <strong>Lưu ý quan trọng:</strong> Không được làm sai câu hỏi
                điểm liệt, sai là <Badge bg="danger">KHÔNG ĐẠT</Badge>
              </Alert>

              <div className="exam-selection mt-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <Play className="me-2 text-primary" size={18} />
                  Chọn đề thi để luyện tập:
                </h6>
                <div className="exam-buttons-grid">
                  {exams.map((exam, index) => (
                    <Button
                      key={exam._id}
                      variant="outline-primary"
                      className="exam-button mb-2 me-2"
                      onClick={() => {
                        localStorage.removeItem(`exam_${exam._id}_submitted`);
                        navigate(`/user/exam/${exam._id}`);
                      }}
                    >
                      <BookOpen size={16} className="me-1" />
                      {exam.title}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold text-danger mb-2">Luyện thêm:</h6>
                  <Button variant="danger" size="sm" className="special-button">
                    <AlertTriangle size={16} className="me-1" />
                    20 Câu Hỏi Điểm Liệt A1
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MainContent;
