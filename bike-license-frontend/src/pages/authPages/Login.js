import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  UserPlus,
  AlertCircle,
  Key,
} from "lucide-react";
import API from "../../services/api";
import "./styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, role, name } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);

        // Success animation delay
        await new Promise((resolve) => setTimeout(resolve, 500));

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
      setError("Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (validationErrors.email) {
        setValidationErrors((prev) => ({ ...prev, email: null }));
      }
    } else if (field === "password") {
      setPassword(value);
      if (validationErrors.password) {
        setValidationErrors((prev) => ({ ...prev, password: null }));
      }
    }

    if (error) setError(null);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Vui lòng nhập email để đặt lại mật khẩu",
      }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Email không hợp lệ",
      }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/forgot_password", { email });

      console.log("✅ Forgot password response:", response.data);

      if (response.data.success) {
        navigate("/reset-password", { state: { email } });
      } else {

        setError(
          response.data.message || "Không thể gửi mã OTP. Vui lòng thử lại sau."
        );
      }
    } catch (err) {
      console.error("❌ Forgot password error:", err);

      if (err.response) {
        console.log("⛔ Response status:", err.response.status);
        console.log("⛔ Response data:", err.response.data);

        setError(
          err.response.data.message ||
            "Đã xảy ra lỗi phía máy chủ. Vui lòng thử lại sau."
        );
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
        </div>

        {/* Main Card */}
        <Card className={`auth-card login-card ${isVisible ? "visible" : ""}`}>
          <div className="auth-header">
            <h2 className="auth-title">Đăng Nhập</h2>
            <p className="auth-subtitle">Chào mừng bạn quay trở lại!</p>
          </div>

          <div className="auth-body">
            {error && (
              <Alert variant="danger" className="auth-alert error-alert">
                <AlertCircle size={16} className="me-2" />
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} className="me-2" />
                  Địa chỉ email
                </label>
                <InputGroup
                  className={`auth-input-group ${
                    validationErrors.email ? "error" : ""
                  }`}
                >
                  <InputGroup.Text className="input-icon">
                    <Mail size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="auth-input"
                    disabled={loading}
                  />
                </InputGroup>
                {validationErrors.email && (
                  <div className="error-message">
                    <AlertCircle size={14} className="me-1" />
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} className="me-2" />
                  Mật khẩu
                </label>
                <InputGroup
                  className={`auth-input-group ${
                    validationErrors.password ? "error" : ""
                  }`}
                >
                  <InputGroup.Text className="input-icon">
                    <Lock size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="auth-input"
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup>
                {validationErrors.password && (
                  <div className="error-message">
                    <AlertCircle size={14} className="me-1" />
                    {validationErrors.password}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="auth-button primary-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="me-2" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </Form>
          </div>

          <div className="auth-footer">
            <div className="auth-actions">
              <Button
                variant="outline-secondary"
                className="secondary-button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                <ArrowLeft size={16} className="me-1" />
                Quay lại
              </Button>
              <Button
                variant="outline-primary"
                className="secondary-button"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                <UserPlus size={16} className="me-1" />
                Đăng ký
              </Button>
              <Button
                variant="outline-primary"
                className="secondary-button"
                onClick={handleForgotPassword}
                disabled={loading || !email}
              >
                <Key size={16} className="me-1" />
                Quên mật khẩu
              </Button>
            </div>

            <div className="auth-divider">
              <span>Hoặc</span>
            </div>

            <p className="auth-help-text">
              Chưa có tài khoản?{" "}
              <Button
                variant="link"
                className="link-button"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Đăng ký ngay
              </Button>
            </p>
          </div>
        </Card>

        {/* Background Pattern */}
        <div className="background-pattern">
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
