import React from "react";

import { Container } from "react-bootstrap";
import MainContent from "./components/UI/MainContent";
import Layout from "./components/layout/Layout";

const Home = () => {
  return (
    <Layout>
      {/*Title*/}
      <h2 className="text-center mt-4 fw-bold text-uppercase">
        Đề Thi Thử Bằng Lái Xe Máy A1
      </h2>
      <Container>
        <MainContent />
      </Container>
    </Layout>
  );
};

export default Home;
