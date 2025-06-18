import { useState, useEffect } from "react";
import { Table, Button, Pagination, Spinner } from "react-bootstrap";


const QuestionList = ({ questions, onEdit, onDelete, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  useEffect(() => {
    // Hiệu ứng loading khi chuyển trang
    setIsLoading(true);

    const timer = setTimeout(() => {
      const startIdx = (currentPage - 1) * itemsPerPage;
      setCurrentQuestions(questions.slice(startIdx, startIdx + itemsPerPage));
      setIsLoading(false);
    }, 300); // thời gian giả lập load, có thể điều chỉnh

    return () => clearTimeout(timer);
  }, [currentPage, questions, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <div>Đang tải trang...</div>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
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
                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td>{q.content}</td>
                <td>
                  {q.answers?.find((a) => a.isCorrect)?.text || "Không rõ"}
                </td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => onEdit(q)}>
                    Sửa
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(q._id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <Pagination className="justify-content-center">
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
  );
};

export default QuestionList;
