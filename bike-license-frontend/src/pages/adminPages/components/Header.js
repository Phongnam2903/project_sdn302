import React from "react";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";

const Header = ({ user, onLogout }) => {
  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/admin">Admin Panel</Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center">
          {user && (
            <>
              <Image
                src="/images/avatar_default.png"
                roundedCircle
                width={30}
                height={30}
                className="me-2"
              />
              <span className="text-white me-3">{user.name}</span>
              <Button variant="outline-light" onClick={onLogout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
