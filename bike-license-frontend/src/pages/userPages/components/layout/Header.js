"use client";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User, LogOut, BookOpen, Award, FileText } from "lucide-react";
import "../../style/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm" variant="dark">
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bold d-flex align-items-center"
          style={{ fontSize: "1.5rem" }}
        >
          <Award className="me-2" size={28} />
          Thi Bằng Lái A1
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" className="nav-item-custom">
              <FileText size={16} className="me-1" />
              Đăng Ký Thi A1
            </Nav.Link>
            <Nav.Link href="#" className="nav-item-custom">
              <FileText size={16} className="me-1" />
              Đăng Ký Thi A
            </Nav.Link>
            <Nav.Link href="#" className="nav-item-custom">
              <BookOpen size={16} className="me-1" />
              Ôn Thi GPLX A1
            </Nav.Link>
            <Nav.Link href="#" className="nav-item-custom">
              <BookOpen size={16} className="me-1" />
              Ôn Thi GPLX A
            </Nav.Link>
            <Nav.Link href="#" className="nav-item-custom text-warning">
              <Award size={16} className="me-1" />
              20 Câu Điểm Liệt
            </Nav.Link>
          </Nav>

          <Nav>
            {token ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={16} className="me-1" />
                    {name}
                  </span>
                }
                id="user-nav-dropdown"
                className="user-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  <User size={16} className="me-2" />
                  Hồ sơ cá nhân
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <LogOut size={16} className="me-2" />
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                className="btn btn-outline-light btn-sm px-3"
                onClick={() => navigate("/login")}
              >
                <User size={16} className="me-1" />
                Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
