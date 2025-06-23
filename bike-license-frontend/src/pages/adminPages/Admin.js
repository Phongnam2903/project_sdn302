import { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";
import API from "../../services/api";
import RandomExamCreate from "./components/RandomExamCreate";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("questions");
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState({
    content: "",
    category: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    image: null,
  });

  const user = {
    name: localStorage.getItem("name"),
    avatar: "/default-avatar.png",
  };

  useEffect(() => {
    loadQuestions();
    loadExams();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await API.get("/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Lỗi tải câu hỏi:", err);
      if (err.response?.status === 401) {
        alert("Phiên đăng nhập đã hết, vui lòng đăng nhập lại.");
        handleLogout();
      }
    }
  };

  const loadExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error("Lỗi tải đề thi:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const resetForm = () => {
    setCurrentQuestion({
      content: "",
      category: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      image: null,
    });
    setEditMode(false);
  };

  const handleEdit = (question) => {
    setCurrentQuestion({ ...question });
    setEditMode(true);
    setModalShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá câu hỏi này?")) {
      await API.delete(`/questions/${id}`);
      loadQuestions();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCurrentQuestion({ ...currentQuestion, image: files[0] });
    } else {
      setCurrentQuestion({ ...currentQuestion, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("content", currentQuestion.content);
    formData.append("category", currentQuestion.category);
    formData.append("answers", JSON.stringify(currentQuestion.answers));
    if (currentQuestion.image instanceof File) {
      formData.append("image", currentQuestion.image);
    }

    try {
      if (editMode) {
        await API.put(`/questions/${currentQuestion._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/questions/createQuestions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      loadQuestions();
      setModalShow(false);
      resetForm();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Row>
        <Col
          md={2}
          className={`sidebar-container ${
            sidebarOpen ? "d-block" : "d-none"
          } d-md-block`}
        >
          <Sidebar active={activeView} onSelect={setActiveView} />
        </Col>
        <Col md={10} className="p-4">
          {activeView === "questions" && (
            <QuestionList
              questions={questions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {activeView === "add" && (
            <QuestionForm
              question={currentQuestion}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
          {activeView === "exams" && <RandomExamCreate />}
        </Col>
      </Row>

      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          resetForm();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Chỉnh sửa" : "Thêm"} câu hỏi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuestionForm
            question={currentQuestion}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModalShow(false);
              resetForm();
            }}
          >
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Admin;
