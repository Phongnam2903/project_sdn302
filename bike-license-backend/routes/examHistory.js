const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const ExamHistory = require("../models/ExamHistory");
const { auth } = require("../middleware/auth");

// POST /api/exam-history
router.post("/", auth, async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const exam = await Exam.findById(examId).populate("questions");

    if (!exam) return res.status(404).json({ error: "Không tìm thấy đề thi" });

    let correctCount = 0;
    const historyQuestions = [];

    for (const q of exam.questions) {
      const selectedIndex = answers[q._id] ?? -1;
      const correctIndex = q.answers.findIndex((a) => a.isCorrect);

      if (selectedIndex === correctIndex) correctCount++;

      historyQuestions.push({
        questionId: q._id,
        selectedAnswerIndex: selectedIndex,
        correctAnswerIndex: correctIndex,
      });
    }

    const score = correctCount;
    const passed = score >= exam.questions.length * 0.5;

    const saved = await ExamHistory.create({
      userId: req.user.id,
      examId,
      questions: historyQuestions,
      score,
      passed,
    });

    res.json(saved);
  } catch (err) {
    console.error("❌ Lỗi lưu lịch sử:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const histories = await ExamHistory.find({ userId: req.user.id })
      .populate("examId")
      .sort({ createdAt: -1 });

    res.json(histories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const history = await ExamHistory.findById(req.params.id)
      .populate({
        path: "questions.questionId",
        model: "Question",
      })
      .populate("examId");

    if (!history || history.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
