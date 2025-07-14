import { Container } from "react-bootstrap";
import MainContent from "./components/UI/MainContent";
import Layout from "./components/layout/Layout";
import { Award, BookOpen } from "lucide-react";
import "./style/Home.css";
import "./style/MainContent.css";

const Home = () => {
  return (
    <Layout>
      <div className="hero-section">
        <Container>
          <div className="hero-content text-center">
            <div className="hero-icon mb-3">
              <Award size={48} className="text-warning" />
            </div>
            <h1 className="hero-title mb-3">Đề Thi Thử Bằng Lái Xe Máy A1</h1>
            <p className="hero-subtitle mb-4">
              Luyện tập với bộ đề thi chuẩn theo quy định của Bộ Công An
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <BookOpen className="stat-icon" />
                <div className="stat-number">250+</div>
                <div className="stat-label">Câu hỏi</div>
              </div>
              <div className="stat-item">
                <Award className="stat-icon" />
                <div className="stat-number">10+</div>
                <div className="stat-label">Đề thi</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <MainContent />
      </Container>
    </Layout>
  );
};

export default Home;
