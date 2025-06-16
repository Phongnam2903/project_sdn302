import { Button, Card } from "react-bootstrap";

function Documents() {
  return (
    <Card className="mb-5">
      <Card.Body>
        <ul className="mb-0">
          <li>
            <span className="text-danger fw-bold">
              Tài liệu 250 câu hỏi lý thuyết lái xe A1 - A:
            </span>
            <Button variant="success" size="sm" className="ms-2">
              Tải về
            </Button>
          </li>
          <li className="mt-2">
            <span className="text-danger fw-bold">
              Phần mềm thi thử lý thuyết của Bộ Công An:
            </span>
            <Button variant="success" size="sm" className="ms-2">
              Tải về
            </Button>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
export default Documents;
