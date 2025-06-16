import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { name: username, email, password });
      navigate("/login");
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
        backgroundSize: "cover",
        minHeight: "100vh",
        paddingTop: "60px",
      }}
    >
      <Container>
        <Row
          className="justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <Col md={6} lg={5}>
            <Card className="p-4 shadow-lg bg-white bg-opacity-90 rounded">
              <h3 className="text-center mb-4">Đăng ký tài khoản</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và TênTên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    ⬅ Quay lại
                  </Button>
                  <Button variant="success" onClick={handleRegister}>
                    Đăng ký
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
