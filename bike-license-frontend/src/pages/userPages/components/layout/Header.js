import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
    <Nav
      className="justify-content-center bg-success text-white py-2"
      variant="pills"
    >
      <Nav.Item>
        <Nav.Link className="text-white" href="#">
          Đăng Ký Thi A1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="text-white" href="#">
          Đăng Ký Thi A
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="text-white" href="#">
          Ôn Thi GPLX A1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="text-white" href="#">
          Ôn Thi GPLX A
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="text-white" href="#">
          20 Câu Điểm Liệt
        </Nav.Link>
      </Nav.Item>

      {token ? (
        <>
          <NavDropdown title={name} id="user-nav-dropdown">
            <NavDropdown.Item onClick={() => navigate("/profile")}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </>
      ) : (
        <Nav.Item>
          <Nav.Link className="text-white" onClick={() => navigate("/login")}>
            Login
          </Nav.Link>
        </Nav.Item>
      )}
    </Nav>
  );
}
