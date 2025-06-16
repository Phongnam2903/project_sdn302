const express = require("express");
const router = express.Router();
const ExamHistory = require("../models/ExamHistory");
const Question = require("../models/Question");
const { auth } = require("../middleware/auth");

router.post("/submit", auth, async (req, res) => {
  const { answers } = req.body;
  let score = 0;
  const history = [];

  for (const answer of answers) {
    const question = await Question.findById(answer.questionId);
    const correctIndex = question.answers.findIndex((a) => a.isCorrect);
    if (answer.selectedIndex === correctIndex) score++;

    history.push({
      questionId: question._id,
      selectedAnswerIndex: answer.selectedIndex,
      correctAnswerIndex: correctIndex,
    });
  }

  const passed = score >= 21;
  const exam = await ExamHistory.create({
    userId: req.user.id,
    questions: history,
    score,
    passed,
  });

  res.json({ score, passed });
});

router.get("/history", auth, async (req, res) => {
  try {
    const history = await ExamHistory.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
