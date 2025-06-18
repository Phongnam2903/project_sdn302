const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  answers: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  category: String,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
