import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  InputGroup,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
} from "lucide-react";
import API from "../../services/api";
import "./styles/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSuccessModal, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Tên là bắt buộc";
    } else if (formData.username.length < 2) {
      errors.username = "Tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Register error:", err);
      setValidationErrors({
        general:
          err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "danger";
    if (passwordStrength < 50) return "warning";
    if (passwordStrength < 75) return "info";
    return "success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Yếu";
    if (passwordStrength < 50) return "Trung bình";
    if (passwordStrength < 75) return "Khá";
    return "Mạnh";
  };

  return (
    <div className="auth-background register-bg">
      <div className="auth-container">
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
          <div className="floating-element element-5"></div>
        </div>

        {/* Main Card */}
        <Card
          className={`auth-card register-card ${isVisible ? "visible" : ""}`}
        >
          <div className="auth-header">
            <div className="auth-icon register-icon">
              <UserPlus size={32} />
            </div>
            <h2 className="auth-title">Đăng Ký Tài Khoản</h2>
            <p className="auth-subtitle">Tạo tài khoản để bắt đầu học tập!</p>
          </div>

          <div className="auth-body">
            {validationErrors.general && (
              <div className="auth-alert error-alert">
                <AlertCircle size={16} className="me-2" />
                {validationErrors.general}
              </div>
            )}

            <Form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} className="me-2" />
                  Họ và tên
                </label>
                <InputGroup
                  className={`auth-input-group ${
                    validationErrors.username ? "error" : ""
                  }`}
                >
                  <InputGroup.Text className="input-icon">
                    <User size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="auth-input"
                    disabled={loading}
                  />
                </InputGroup>
                {validationErrors.username && (
                  <div className="error-message">
                    <AlertCircle size={14} className="me-1" />
                    {validationErrors.username}
                  </div>
                )}
              </div>

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
                    value={formData.email}
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
                    placeholder="Tạo mật khẩu mạnh"
                    value={formData.password}
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

                {formData.password && (
                  <div className="password-strength">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Độ mạnh mật khẩu</small>
                      <small className={`text-${getPasswordStrengthColor()}`}>
                        {getPasswordStrengthText()}
                      </small>
                    </div>
                    <ProgressBar
                      variant={getPasswordStrengthColor()}
                      now={passwordStrength}
                      className="password-strength-bar"
                    />
                  </div>
                )}

                {validationErrors.password && (
                  <div className="error-message">
                    <AlertCircle size={14} className="me-1" />
                    {validationErrors.password}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={16} className="me-2" />
                  Xác nhận mật khẩu
                </label>
                <InputGroup
                  className={`auth-input-group ${
                    validationErrors.confirmPassword ? "error" : ""
                  }`}
                >
                  <InputGroup.Text className="input-icon">
                    <Shield size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="auth-input"
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </InputGroup>
                {validationErrors.confirmPassword && (
                  <div className="error-message">
                    <AlertCircle size={14} className="me-1" />
                    {validationErrors.confirmPassword}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="auth-button primary-button register-button"
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="me-2" />
                    Tạo tài khoản
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
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                <ArrowLeft size={16} className="me-1" />
                Quay lại
              </Button>
            </div>

            <div className="auth-divider">
              <span>Hoặc</span>
            </div>

            <p className="auth-help-text">
              Đã có tài khoản?{" "}
              <Button
                variant="link"
                className="link-button"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Đăng nhập ngay
              </Button>
            </p>
          </div>
        </Card>

        {/* Success Modal */}
        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
          className="success-modal"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className="text-center p-5">
            <div className="success-animation">
              <div className="success-icon">
                <CheckCircle size={64} className="text-success" />
              </div>
              <div className="success-ripple"></div>
            </div>

            <h4 className="success-title mt-4 mb-3">🎉 Đăng ký thành công!</h4>

            <p className="success-message mb-4">
              Tài khoản của bạn đã được tạo thành công.
              <br />
              Đang chuyển hướng đến trang đăng nhập...
            </p>

            <div className="countdown-section">
              <div className="countdown-circle">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="countdown-text">giây</p>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate("/login")}
              className="success-button"
            >
              <Zap size={16} className="me-2" />
              Đăng nhập ngay
            </Button>
          </Modal.Body>
        </Modal>

        {/* Background Pattern */}
        <div className="background-pattern register-pattern">
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
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

export default Register;
