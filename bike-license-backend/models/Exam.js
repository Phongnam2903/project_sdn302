const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    // Danh sách câu hỏi thuộc đề
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],

    // Tổng số câu hỏi (nên tự tính khi tạo)
    totalQuestions: {
      type: Number,
      default: 0,
    },

    // Thời gian làm bài (phút)
    duration: {
      type: Number,
      default: 20, // ví dụ: 20 phút
    },

    // Đề dành cho loại bằng gì (A1, A2, B1,...)
    category: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
