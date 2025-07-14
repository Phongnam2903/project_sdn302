import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Youtube,
  MessageCircle,
  Award,
  BookOpen,
  Users,
  Star,
  ArrowUp,
  ExternalLink,
  Shield,
  Heart,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import "../../style/Footer.css";
const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const quickLinks = [
    { name: "Trang chủ", href: "/", icon: BookOpen },
    { name: "Đề thi A1", href: "/exams/a1", icon: Award },
    { name: "Đề thi A", href: "/exams/a", icon: Award },
    { name: "Câu hỏi liệt", href: "/critical-questions", icon: Shield },
    { name: "Hướng dẫn", href: "/guide", icon: BookOpen },
    { name: "Liên hệ", href: "/contact", icon: MessageCircle },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/hoclaixemoto",
      icon: Facebook,
      color: "#1877f2",
      followers: "10K+",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/hoclaixemoto",
      icon: Youtube,
      color: "#ff0000",
      followers: "5K+",
    },
    {
      name: "Zalo",
      href: "https://zalo.me/0932696911",
      icon: MessageCircle,
      color: "#0068ff",
      followers: "Chat",
    },
  ];

  const stats = [
    { number: "50K+", label: "Học viên", icon: Users },
    { number: "95%", label: "Tỷ lệ đậu", icon: Award },
    { number: "4.9/5", label: "Đánh giá", icon: Star },
    { number: "24/7", label: "Hỗ trợ", icon: Clock },
  ];

  return (
    <footer className="modern-footer">
      {/* Stats Section */}
      <div className="footer-stats">
        <Container>
          <Row className="stats-row">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="stat-col">
                <div
                  className="stat-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="stat-icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <Container>
          <Row className="g-4">
            {/* Brand Section */}
            <Col lg={4} md={6}>
              <div className="footer-brand">
                <div className="brand-logo">
                  <Award size={32} />
                  <span>Thi Bằng Lái A1</span>
                </div>
                <p className="brand-description">
                  Trung tâm đào tạo lái xe uy tín hàng đầu Việt Nam. Chúng tôi
                  cam kết mang đến chất lượng giáo dục tốt nhất với đội ngũ
                  giảng viên giàu kinh nghiệm.
                </p>

                <div className="contact-info">
                  <div className="contact-item">
                    <Phone className="contact-icon" size={16} />
                    <div className="contact-details">
                      <strong>Hotline 24/7</strong>
                      <a href="tel:0932696911">0932.696.911</a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <Mail className="contact-icon" size={16} />
                    <div className="contact-details">
                      <strong>Email hỗ trợ</strong>
                      <a href="mailto:support@hoclaixemoto.com">
                        support@hoclaixemoto.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <MapPin className="contact-icon" size={16} />
                    <div className="contact-details">
                      <strong>Địa chỉ</strong>
                      <span>123 Đường ABC, Quận 1, TP.HCM</span>
                    </div>
                  </div>

                  <div className="contact-item">
                    <Clock className="contact-icon" size={16} />
                    <div className="contact-details">
                      <strong>Giờ làm việc</strong>
                      <span>T2-CN: 7:00 - 19:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h5 className="footer-title">
                  <Zap size={18} className="me-2" />
                  Liên kết nhanh
                </h5>
                <ul className="footer-links">
                  {quickLinks.map((link, index) => (
                    <li
                      key={index}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <a href={link.href} className="footer-link">
                        <link.icon size={14} className="link-icon" />
                        {link.name}
                        <ExternalLink size={12} className="external-icon" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Services */}
            <Col lg={3} md={6}>
              <div className="footer-section">
                <h5 className="footer-title">
                  <BookOpen size={18} className="me-2" />
                  Dịch vụ đào tạo
                </h5>
                <ul className="footer-links">
                  <li>
                    <a href="#" className="footer-link">
                      <Award size={14} className="link-icon" />
                      Khóa học A1 cơ bản
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      <Award size={14} className="link-icon" />
                      Khóa học A nâng cao
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      <Shield size={14} className="link-icon" />
                      Luyện thi sát hạch
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      <BookOpen size={14} className="link-icon" />
                      Học lý thuyết online
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      <Users size={14} className="link-icon" />
                      Đào tạo doanh nghiệp
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      <MessageCircle size={14} className="link-icon" />
                      Tư vấn miễn phí
                    </a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Social & Newsletter */}
            <Col lg={3} md={6}>
              <div className="footer-section">
                <h5 className="footer-title">
                  <Heart size={18} className="me-2" />
                  Kết nối với chúng tôi
                </h5>

                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="social-link"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        "--social-color": social.color,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="social-icon">
                        <social.icon size={20} />
                      </div>
                      <div className="social-info">
                        <span className="social-name">{social.name}</span>
                        <span className="social-followers">
                          {social.followers}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="newsletter-section">
                  <h6 className="newsletter-title">Nhận thông tin mới nhất</h6>
                  <p className="newsletter-desc">
                    Đăng ký để nhận tin tức, mẹo lái xe và ưu đãi đặc biệt
                  </p>
                  <div className="newsletter-form">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="newsletter-input"
                    />
                    <Button className="newsletter-button">
                      <Mail size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="copyright">
                <p className="mb-0">
                  © {currentYear} <strong>Trường Dạy Lái Xe Tân Sơn</strong>.
                  Tất cả quyền được bảo lưu.
                </p>
                <div className="legal-links">
                  <a href="/privacy">Chính sách bảo mật</a>
                  <span className="separator">•</span>
                  <a href="/terms">Điều khoản sử dụng</a>
                  <span className="separator">•</span>
                  <a href="/sitemap">Sơ đồ trang</a>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="footer-badges">
                <div className="badge-item">
                  <Shield size={16} />
                  <span>Được cấp phép</span>
                </div>
                <div className="badge-item">
                  <Award size={16} />
                  <span>Chất lượng cao</span>
                </div>
                <div className="badge-item">
                  <img
                    src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=5bd12f7e-cb2f-476f-9ff5-ff8e340ec7d5"
                    alt="DMCA Protection"
                    className="dmca-badge"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Scroll to Top Button */}
      <Button
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        <ArrowUp size={20} />
      </Button>

      {/* Floating Contact Buttons */}
      {/* <div className="floating-contacts">
        <a href="tel:0932696911" className="floating-btn phone-btn">
          <Phone size={20} />
         
        </a>
        <a
          href="https://zalo.me/0932696911"
          className="floating-btn zalo-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
          
        </a>
      </div> */}
    </footer>
  );
};

export default Footer;
