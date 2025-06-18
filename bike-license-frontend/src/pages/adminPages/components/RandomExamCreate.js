import React, { useEffect, useState } from "react";
import { Form, Button, Table, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const RandomExamCreate = () => {
  const [examForm, setExamForm] = useState({
    title: "",
    category: "",
    questionCount: 19,
  });
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error("Lỗi tải đề thi:", err);
    }
  };

  const handleExamFormChange = (e) => {
    const { name, value } = e.target;
    setExamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateExam = async () => {
    try {
      await API.post("/exams/random", examForm);
      alert("Tạo đề thành công!");
      setExamForm({ title: "", category: "", questionCount: 5 });
      loadExams();
    } catch (err) {
      alert(err.response?.data?.error || "Tạo đề thất bại.");
    }
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = exams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(exams.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/exams/${id}`);
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá đề thi này?")) {
      try {
        await API.delete(`/exams/${id}`);
        alert("Xoá thành công!");
        loadExams(); // Reload lại danh sách sau khi xoá
      } catch (err) {
        console.error("Xoá thất bại:", err);
        alert("Xoá đề thi thất bại.");
      }
    }
  };

  return (
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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentExams.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.title}</td>
              <td>{exam.category}</td>
              <td>{exam.questions.length}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewDetail(exam._id)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteExam(exam._id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </>
  );
};

export default RandomExamCreate;
