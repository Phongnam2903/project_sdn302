const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const { auth, isAdmin } = require("../middleware/auth");

// POST /api/exams/random
router.post("/random", auth, isAdmin, async (req, res) => {
  try {
    const { title, questionCount } = req.body;

    if (!title || !questionCount || questionCount < 1) {
      return res
        .status(400)
        .json({ error: "Thiếu thông tin hoặc số câu không hợp lệ" });
    }

    // 1. Chọn 1 câu điểm liệt ngẫu nhiên
    const fatalQuestion = await Question.aggregate([
      {
        $match: {
          category: { $regex: /^điểm liệt$/i },
        },
      },
      { $sample: { size: 1 } },
    ]);

    if (fatalQuestion.length === 0) {
      return res
        .status(400)
        .json({ error: "Không có câu hỏi thuộc 'Điểm liệt'" });
    }

    // 2. Chọn các câu còn lại (không phải điểm liệt)
    const normalQuestions = await Question.aggregate([
      {
        $match: {
          category: { $not: { $regex: /^điểm liệt$/i } },
          _id: { $nin: fatalQuestion.map((q) => q._id) },
        },
      },
      { $sample: { size: questionCount - 1 } },
    ]);

    if (normalQuestions.length < questionCount - 1) {
      return res
        .status(400)
        .json({ error: "Không đủ câu hỏi không thuộc 'Điểm liệt'" });
    }

    // 3. Tạo đề thi
    const exam = await Exam.create({
      title,
      category: "Tổng hợp",
      questions: [...fatalQuestion, ...normalQuestions].map((q) => q._id),
      createdBy: req.user.id,
    });

    res.status(201).json(exam);
  } catch (err) {
    console.error("Tạo đề ngẫu nhiên lỗi:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exams get all exams
router.get("/", auth, async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
