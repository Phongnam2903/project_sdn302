// pages/adminPages/RandomExamCreate.jsx
import React, { useState } from "react";
import axios from "axios";

const RandomExamCreate = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/exams/random", {
        title,
        category,
        questionCount: parseInt(questionCount),
      });
      setMessage("✅ Tạo đề thành công: " + res.data.title);
    } catch (err) {
      setMessage("❌ Lỗi: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="container">
      <h2>Tạo đề ngẫu nhiên</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề đề:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Chuyên mục:</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Số câu hỏi:</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          />
        </div>
        <button type="submit">Tạo đề</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RandomExamCreate;
