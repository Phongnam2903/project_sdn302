import { useState, useEffect } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";
import API from "../../services/api";

const Admin = () => {
  const [activeView, setActiveView] = useState("questions");
  const [questions, setQuestions] = useState([]);
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
  }, []);

  const loadQuestions = async () => {
    const res = await API.get("/questions");
    setQuestions(res.data);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
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
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Row>
        <Col md={2}>
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
        </Col>
      </Row>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
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
      </Modal>
    </>
  );
};

export default Admin;
