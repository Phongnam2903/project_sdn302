const express = require("express");
const multer = require("multer");
const Question = require("../models/Question");

const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//Get all questions
router.get("/", auth, isAdmin, async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

//Create a new question
router.post(
  "/createQuestions",
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { content, category, answers } = req.body;
      if (!content || !answers || JSON.parse(answers).length < 2) {
        return res.status(400).json({ error: "Invalid question data" });
      }
      const question = await Question.create({
        content,
        category,
        answers: JSON.parse(answers),
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });
      res.status(201).json(question);
    } catch (err) {
      console.log("Upload erro:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

//Update question
router.put("/:id", auth, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { content, category, answers } = req.body;
    if (!content || !answers || JSON.parse(answers).length < 2) {
      return res.status(400).json({ error: "Invalid question data" });
    }

    const updatedData = {
      content,
      category,
      answers: JSON.parse(answers),
    };
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.log("Upload erro:", err);
    res.status(500).json({ error: err.message });
  }
});

//Delete a question
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
