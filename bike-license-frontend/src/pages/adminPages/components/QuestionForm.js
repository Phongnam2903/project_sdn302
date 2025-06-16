import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

const QuestionForm = ({ question, onChange, onSubmit }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();

    // Hiển thị thông báo
    setShowSuccess(true);

    // Ẩn sau 3 giây
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = question.answers.map((ans, i) => {
      if (i === index) {
        return { ...ans, [field]: field === "isCorrect" ? true : value };
      } else if (field === "isCorrect") {
        return { ...ans, isCorrect: false };
      }
      return ans;
    });
    onChange({ target: { name: "answers", value: updatedAnswers } });
  };

  const handleAddAnswer = () => {
    if (question.answers.length >= 4) return;
    const newAnswers = [...question.answers, { text: "", isCorrect: false }];
    onChange({ target: { name: "answers", value: newAnswers } });
  };

  const handleRemoveAnswer = (index) => {
    if (question.answers.length <= 1) return;
    const newAnswers = question.answers.filter((_, i) => i !== index);
    onChange({ target: { name: "answers", value: newAnswers } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {showSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowSuccess(false)}
          dismissible
        >
          ✅ Câu hỏi đã được lưu thành công!
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Câu hỏi</strong>
        </Form.Label>
        <Form.Control
          name="content"
          value={question.content}
          onChange={onChange}
        />
      </Form.Group>

      {question.answers.map((answer, i) => (
        <Form.Group key={i} className="mb-3">
          <Row>
            <Col xs={1} className="d-flex align-items-center">
              <strong>{String.fromCharCode(65 + i)}.</strong>
            </Col>
            <Col xs={7}>
              <Form.Control
                type="text"
                placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(i, "text", e.target.value)}
              />
            </Col>
            <Col xs={2} className="d-flex align-items-center">
              <Form.Check
                type="radio"
                label="Đúng"
                name="correctAnswer"
                checked={answer.isCorrect}
                onChange={() => handleAnswerChange(i, "isCorrect", true)}
              />
            </Col>
            <Col xs={2} className="d-flex align-items-center gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={handleAddAnswer}
                title="Thêm đáp án"
              >
                +
              </Button>
              {question.answers.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveAnswer(i)}
                  title="Xoá đáp án"
                >
                  🗑
                </Button>
              )}
            </Col>
          </Row>
        </Form.Group>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Hình ảnh (tuỳ chọn)</strong>
        </Form.Label>
        <Form.Control
          type="file"
          name="image"
          accept="image/*"
          onChange={onChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Chuyên mục</strong>
        </Form.Label>
        <Form.Control
          name="category"
          value={question.category}
          onChange={onChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Lưu câu hỏi
      </Button>
    </Form>
  );
};

export default QuestionForm;
