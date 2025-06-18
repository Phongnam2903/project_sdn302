import { useState, useEffect } from "react";
import { Row, Col, Modal, Button, Form, Table } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";
import API from "../../services/api";

const Admin = () => {
  const [activeView, setActiveView] = useState("questions");
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    category: "",
    questionCount: 5,
  });
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

  const handleExamFormChange = (e) => {
    const { name, value } = e.target;
    setExamForm({ ...examForm, [name]: value });
  };

  const handleCreateExam = async () => {
    try {
      const res = await API.post("/exams/random", examForm);
      alert("Tạo đề thành công!");
      setExamForm({ title: "", category: "", questionCount: 5 });
      loadExams();
    } catch (err) {
      alert(err.response?.data?.error || "Tạo đề thất bại.");
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
          {activeView === "exams" && (
            <>
              <h4>Tạo đề ngẫu nhiên</h4>
              <Form className="mb-3">
                <Form.Group>
                  <Form.Label>Tiêu đề</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={examForm.title}
                    onChange={handleExamFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Chuyên mục</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={examForm.category}
                    onChange={handleExamFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Số câu hỏi</Form.Label>
                  <Form.Control
                    type="number"
                    name="questionCount"
                    value={examForm.questionCount}
                    onChange={handleExamFormChange}
                  />
                </Form.Group>
                <Button className="mt-2" onClick={handleCreateExam}>
                  🎲 Tạo đề ngẫu nhiên
                </Button>
              </Form>

              <h5>Danh sách đề đã tạo</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Chuyên mục</th>
                    <th>Số câu hỏi</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id}>
                      <td>{exam.title}</td>
                      <td>{exam.category}</td>
                      <td>{exam.questions.length}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
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
