const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const { auth, isAdmin } = require("../middleware/auth");

// POST /api/exams/random
router.post("/random", auth, isAdmin, async (req, res) => {
  try {
    const { title, questionCount } = req.body;
    const fatalCount = 10;

    if (!title || !questionCount || questionCount < fatalCount + 1) {
      return res.status(400).json({
        error: `Thiếu thông tin hoặc số câu không hợp lệ. Cần ít nhất ${fatalCount + 1} câu.`,
      });
    }

    // Lấy ngẫu nhiên fatalCount câu thuộc 'Điểm liệt', chuẩn hóa chuỗi
    const fatalQuestions = await Question.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $trim: { input: { $toLower: "$category" } } },
              "Điểm liệt",
            ],
          },
        },
      },
      { $sample: { size: fatalCount } },
    ]);


    if (fatalQuestions.length < fatalCount) {
      return res
        .status(400)
        .json({ error: `Không đủ ${fatalCount} câu hỏi thuộc 'Điểm liệt'` });
    }

    // Lấy ngẫu nhiên các câu hỏi còn lại (không phải điểm liệt)
    const normalQuestions = await Question.aggregate([
      {
        $match: {
          $expr: {
            $ne: [
              { $trim: { input: { $toLower: "$category" } } },
              "điểm liệt",
            ],
          },
          _id: { $nin: fatalQuestions.map((q) => q._id) },
        },
      },
      { $sample: { size: questionCount - fatalCount } },
    ]);

    if (normalQuestions.length < questionCount - fatalCount) {
      return res
        .status(400)
        .json({ error: "Không đủ câu hỏi không thuộc 'Điểm liệt'" });
    }

    // Tạo đề thi
    const exam = await Exam.create({
      title,
      category: "Tổng hợp",
      questions: [...fatalQuestions, ...normalQuestions].map((q) => q._id),
      createdBy: req.user.id,
    });

    res.status(201).json(exam);
  } catch (err) {
    console.error("Tạo đề ngẫu nhiên lỗi:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");
    if (!exam) {
      res.status(500).json({ error: "Không tìm thấy đề thi" });
    } else {
      res.json(exam);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete exam
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Exam.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
module.exports = router;
