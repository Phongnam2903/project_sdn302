import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../../services/api";

function Profile() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchExamHistories();
    }
  }, [token]);

  const fetchExamHistories = async () => {
    try {
      const res = await API.get("/exam-history/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistories(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy lịch sử bài làm:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout>
      <Container>
        {/* Quay lại trang chủ - Đặt lên đầu */}
        <div className="my-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            ⬅️ Quay lại trang chủ
          </Button>
        </div>

        <h2 className="text-center text-uppercase mb-4 text-primary fw-bold">
          Hồ sơ người dùng
        </h2>

        {/* Thông tin cá nhân */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <Card className="shadow">
              <Card.Header
                as="h5"
                className="bg-primary text-white text-center"
              >
                👤 Thông tin cá nhân
              </Card.Header>
              <Card.Body className="text-start">
                <Card.Text>
                  <strong>Tên:</strong> {name}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {email}
                </Card.Text>
                <Button variant="danger" onClick={handleLogout}>
                  🚪 Đăng xuất
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Lịch sử bài làm */}
        <Row>
          <Col>
            <Card className="shadow">
              <Card.Header as="h5" className="bg-info text-white">
                📝 Lịch sử bài làm
              </Card.Header>
              <Card.Body>
                {histories.length === 0 ? (
                  <p className="text-muted">Chưa có bài làm nào.</p>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Tên đề thi</th>
                        <th>Điểm</th>
                        <th>Kết quả</th>
                        <th>Ngày làm</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {histories.map((h, index) => (
                        <tr key={h._id}>
                          <td>{index + 1}</td>
                          <td>{h.examId?.title || "Không rõ"}</td>
                          <td>
                            <Badge bg="primary" className="px-3 py-2">
                              {h.score}
                            </Badge>
                          </td>
                          <td>
                            {h.passed ? (
                              <Badge bg="success">Đạt ✅</Badge>
                            ) : (
                              <Badge bg="danger">Không đạt</Badge>
                            )}
                          </td>
                          <td>{new Date(h.createdAt).toLocaleString()}</td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => navigate(`/history/${h._id}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Profile;
