import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Alert,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import {
  KeyRound,
  Lock,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import API from "../../services/api";
import "./styles/Auth.css";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/reset_password", {
        email,
        otp,
        password: newPassword,
      });

      if (res.data.success) {
        setSuccess(true);
        setMessage("Đổi mật khẩu thành công. Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setSuccess(false);
        setMessage(res.data.message || "Mã OTP không đúng hoặc đã hết hạn.");
      }
    } catch (err) {
      setSuccess(false);
      setMessage(
        err.response?.data?.message || "Lỗi xảy ra. Vui lòng thử lại."
      );
    }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      const res = await API.post("/auth/forgot_password", { email });
      setMessage(res.data.message || "Đã gửi lại mã OTP.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Không thể gửi lại mã OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        <Card className={`auth-card login-card ${isVisible ? "visible" : ""}`}>
          <div className="auth-header">
            <h2 className="auth-title">Đặt lại mật khẩu</h2>
            <p className="auth-subtitle">
              Nhập mã OTP đã gửi tới email: <strong>{email}</strong>
            </p>
          </div>

          <div className="auth-body">
            {message && (
              <Alert
                variant={success ? "success" : "danger"}
                className="auth-alert"
              >
                {success ? (
                  <CheckCircle2 size={16} className="me-2" />
                ) : (
                  <AlertCircle size={16} className="me-2" />
                )}
                {message}
              </Alert>
            )}

            <Form onSubmit={handleReset} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <KeyRound size={16} className="me-2" />
                  Mã OTP
                </label>
                <InputGroup className="auth-input-group">
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="auth-input"
                    required
                  />
                </InputGroup>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} className="me-2" />
                  Mật khẩu mới
                </label>
                <InputGroup className="auth-input-group">
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                </InputGroup>
              </div>

              <Row className="mt-3">
                <Col xs={6}>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate("/login")}
                    className="w-100"
                  >
                    <ArrowLeft size={16} className="me-1" />
                    Quay lại
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="w-100"
                    onClick={resendOTP}
                    disabled={resending}
                  >
                    <RefreshCcw size={16} className="me-1" />
                    {resending ? "Đang gửi..." : "Gửi lại mã OTP"}
                  </Button>
                </Col>
              </Row>

              <Button
                type="submit"
                className="auth-button primary-button mt-3 w-100"
              >
                Xác nhận
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
