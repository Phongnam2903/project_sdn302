import API from "../../../../services/api";
import { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MainContent() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        setExams(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề thi:", error);
      }
    };
    fetchExams();
  }, []);

  return (
    <Row>
      {/*col left */}
      <Col md={6}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-success text-uppercase fw-bold">
              Phần Mềm Luyện Thi Lý Thuyết 250 Câu A1
            </Card.Title>
            <Card.Img
              variant="top"
              src="/images/thibanglaixemaya1.png"
              alt="img"
              className="my-3"
            />

            <Card.Text>
              Phần mềm được phát triển dựa trên cấu trúc bộ đề thi sát hạch lý
              thuyết lái xe mô tô hạng A1 do Bộ Công An ban hành quy định trong
              kỳ thi sát hạch chính thức.
            </Card.Text>
            <Card.Text>
              Để tập phần thi lý thuyết bằng lái xe A1 tốt nhất, các học viên có
              thể sử dụng trực tiếp 10 bộ đề thi này...
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      {/*col right */}
      <Col md={6}>
        {" "}
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-success text-uppercase fw-bold">
              Bộ Đề Thi Thử Bằng Lái Xe Máy A1
            </Card.Title>
            <Card.Text>
              Cấu trúc đề thi sát hạch gồm
              <strong className="text-danger">25 câu hỏi</strong>, mỗi câu hỏi
              chỉ có
              <strong className="text-danger">
                duy nhất 1 đáp trả lời đúng.
              </strong>
              Khác hẳn với bộ đề thi luật cũ là 2 đáp án. Mỗi đề thi chúng tôi
              sẽ bố trí
              <strong className="text-danger">
                từ 2 - 4 câu hỏi điểm liệt
              </strong>{" "}
              để học viên có thể làm quen và ghi nhớ, tránh việc làm sai câu hỏi
              liệt.
            </Card.Text>
            <ul>
              <li>
                Số lượng câu hỏi:{" "}
                <strong className="text-danger">25 Câu</strong>
              </li>
              <li>
                Yêu cầu làm đúng:{" "}
                <strong className="text-danger">21/25 Câu Đúng</strong>
              </li>
              <li>
                Thời gian: <strong className="text-danger">19 Phút</strong>
              </li>
            </ul>
            <Alert variant="primary">
              <strong>Lưu ý:</strong> Không được làm sai câu hỏi điểm liệt, sai
              là <span className="text-danger fw-bold">"KHÔNG ĐẠT"</span>
            </Alert>

            <div className="mb-2 fw-bold">Chọn đề thi để luyện:</div>
            <div className="d-flex flex-wrap gap-2">
              {/* {exams.map((exam) => (
                <Button
                  key={exam._id}
                  variant="light"
                  className="text-start border rounded p-3"
                  style={{ minWidth: "250px" }}
                  onClick={() => navigate(`/user/exam/${exam._id}`)}
                >
                  <h5 className="mb-1">{exam.title}</h5>
                  <div>📂 Chuyên mục: {exam.category}</div>
                  <div>❓ Số câu hỏi: {exam.questions.length}</div>
                </Button>
              ))} */}
              {exams.map((exam) => {
                console.log("🎯 ID đề thi:", exam._id); // Thêm dòng này
                return (
                  <Button
                    key={exam._id}
                    onClick={() => navigate(`/user/exam/${exam._id}`)}
                  >
                    {exam.title}
                  </Button>
                );
              })}
            </div>

            <div className="mt-3 fw-bold text-danger">Luyện thêm:</div>
            <Button variant="success" size="sm" className="mt-1">
              20 Câu Hỏi Liệt A1
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
export default MainContent;
