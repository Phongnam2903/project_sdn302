import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
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
        <Row className="justify-content-md-center mb-4">
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Thông tin người dùng</Card.Header>
              <Card.Body>
                <Card.Title>Tên: {name}</Card.Title>
                <Card.Text>Email: {email}</Card.Text>
                <Button variant="primary" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="text-left m-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            ⬅️ Quay lại trang chủ
          </Button>
        </div>
        <Row>
          <Col>
            <h4>Lịch sử bài làm</h4>
            {histories.length === 0 ? (
              <p>Chưa có bài làm nào.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên đề thi</th>
                    <th>Điểm</th>
                    <th>Đạt</th>
                    <th>Ngày làm</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((h, index) => (
                    <tr key={h._id}>
                      <td>{index + 1}</td>
                      <td>{h.examId?.title || "Không rõ"}</td>
                      <td>{h.score}</td>
                      <td>{h.passed ? "✅" : "❌"}</td>
                      <td>{new Date(h.createdAt).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="info"
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
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Profile;
