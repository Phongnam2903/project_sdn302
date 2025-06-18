import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, role, name } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError("Đăng nhập thất bại: Không nhận được token");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Sai tài khoản hoặc mật khẩu.");
    }
  };

  return (
    <div className="login-background">
      <Card className="card-login">
        <h3 className="text-center mb-4">Đăng nhập hệ thống</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
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

          <div className="d-grid mb-3">
            <Button variant="primary" onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>
        </Form>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate("/")}>
            ⬅ Quay lại
          </Button>
          <Button
            variant="outline-success"
            onClick={() => navigate("/register")}
          >
            Đăng ký tài khoản
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
