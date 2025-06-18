const mongoose = require("mongoose");

const examHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedAnswerIndex: Number, 
        correctAnswerIndex: Number, 
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ExamHistory = mongoose.model("ExamHistory", examHistorySchema);

module.exports = ExamHistory;
