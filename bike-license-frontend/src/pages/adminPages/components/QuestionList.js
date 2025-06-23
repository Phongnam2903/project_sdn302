import { useState, useEffect } from "react";
import { Table, Button, Pagination, Spinner, Badge } from "react-bootstrap";
import "../style/questionList.css";
const QuestionList = ({ questions, onEdit, onDelete, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const startIdx = (currentPage - 1) * itemsPerPage;
      setCurrentQuestions(questions.slice(startIdx, startIdx + itemsPerPage));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, questions, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="question-list">
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Đang tải trang...</div>
        </div>
      ) : (
        <>
          <h4 className="text-center mb-4 fw-bold">Danh sách câu hỏi</h4>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-success text-center">
              <tr>
                <th>#</th>
                <th>Câu hỏi</th>
                <th>Đáp án đúng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.map((q, i) => (
                <tr key={q._id || i}>
                  <td className="text-center">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td>{q.content}</td>
                  <td className="text-success fw-bold text-center">
                    {q.answers?.find((a) => a.isCorrect)?.text || (
                      <Badge bg="secondary">Không rõ</Badge>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(q)}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(q._id)}
                      >
                        🗑️ Xoá
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination className="justify-content-center mt-3">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
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
      )}
    </div>
  );
};

export default QuestionList;
