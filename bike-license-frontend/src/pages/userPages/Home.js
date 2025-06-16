import React from "react";

import Header from "../userPages/components/Header";
import { Container } from "react-bootstrap";
import MainContent from "./components/MainContent";
import Documents from "./components/Documents";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div className="container-fluid">
      {/* Header */}
      <Header />

      {/*Title*/}
      <h2 className="text-center mt-4 fw-bold text-uppercase">
        Đề Thi Thử Bằng Lái Xe Máy A1
      </h2>
      {/* Main Content */}
      <Container>
        <MainContent />
        <Documents />
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
