import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
};

export default Layout;
