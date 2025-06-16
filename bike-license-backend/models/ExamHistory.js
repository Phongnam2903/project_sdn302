const mongoose = require("mongoose");

const examHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswerIndex: Number,
      correctAnswerIndex: Number,
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  passed: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const ExamHistory = mongoose.model("ExamHistory", examHistorySchema);

module.exports = ExamHistory;

