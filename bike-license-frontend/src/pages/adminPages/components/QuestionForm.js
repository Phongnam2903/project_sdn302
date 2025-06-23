import { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Plus, Trash2 } from "lucide-react";
import "../style/questionForm.css";
const QuestionForm = ({ question, onChange, onSubmit }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    setShowSuccess(true);
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
    <Form onSubmit={handleSubmit} className="question-form">
      <h4 className="mb-4 text-center text-primary fw-bold">📝 Thêm câu hỏi</h4>
      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}
        >
          ✅ Câu hỏi đã được lưu thành công!
        </Alert>
      )}

      <Form.Group className="mb-4">
        <Form.Label>
          <strong>Câu hỏi</strong>
        </Form.Label>
        <Form.Control
          name="content"
          value={question.content}
          onChange={onChange}
          placeholder="Nhập nội dung câu hỏi..."
        />
      </Form.Group>

      <div className="mb-4">
        <Form.Label>
          <strong>Đáp án</strong>
        </Form.Label>
        {question.answers.map((answer, i) => (
          <Row className="align-items-center mb-2" key={i}>
            <Col xs={1}>
              <strong>{String.fromCharCode(65 + i)}.</strong>
            </Col>
            <Col xs={6}>
              <Form.Control
                placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(i, "text", e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Form.Check
                type="radio"
                label="Đúng"
                name="correctAnswer"
                checked={answer.isCorrect}
                onChange={() => handleAnswerChange(i, "isCorrect", true)}
              />
            </Col>
            <Col xs={3} className="d-flex gap-2">
              {question.answers.length < 4 &&
                i === question.answers.length - 1 && (
                  <OverlayTrigger overlay={<Tooltip>Thêm đáp án</Tooltip>}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={handleAddAnswer}
                    >
                      <Plus size={16} />
                    </Button>
                  </OverlayTrigger>
                )}
              {question.answers.length > 1 && (
                <OverlayTrigger overlay={<Tooltip>Xoá đáp án</Tooltip>}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveAnswer(i)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </OverlayTrigger>
              )}
            </Col>
          </Row>
        ))}
      </div>

      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Hình ảnh (tùy chọn)</strong>
        </Form.Label>
        <Form.Control
          type="file"
          name="image"
          accept="image/*"
          onChange={onChange}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>
          <strong>Chuyên mục</strong>
        </Form.Label>
        <Form.Control
          name="category"
          value={question.category}
          onChange={onChange}
          placeholder="VD: Điểm Liệt, Biển Báo..."
        />
      </Form.Group>

      <div className="text-end">
        <Button type="submit" variant="primary" size="md">
          💾 Lưu câu hỏi
        </Button>
      </div>
    </Form>
  );
};

export default QuestionForm;
