import { useEffect, useState } from "react";
import API from "../services/api";
import QuestionCard from "../components/QuestionCard";
import { useNavigate } from "react-router-dom";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/questions/random?count=25").then((res) => setQuestions(res.data));
  }, []);

  const submitExam = async () => {
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedIndex: answers[q._id] ?? -1,
    }));

    const res = await API.post("/exams/submit", { answers: formattedAnswers });
    setResult(res.data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Kết quả</h2>
        <p>
          Điểm: {result.score} / {questions.length}
        </p>
        <p>{result.passed ? "Đậu ✅" : "Rớt ❌"}</p>
        <button
          className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Thi thử</h2>
      {questions.map((q) => (
        <QuestionCard
          key={q._id}
          question={q}
          selectedIndex={answers[q._id]}
          onSelect={(idx) => setAnswers({ ...answers, [q._id]: idx })}
        />
      ))}
      <button
        onClick={submitExam}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Nộp bài
      </button>
    </div>
  );
};

export default Exam;
