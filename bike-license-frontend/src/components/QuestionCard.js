const QuestionCard = ({ question, selectedIndex, onSelect }) => (
  <div className="border rounded p-4 shadow mb-4">
    <p className="font-semibold mb-2">{question.content}</p>
    {question.image && <img src={question.image} alt="question" className="mb-2" />}
    {question.answers.map((a, idx) => (
      <div key={idx} className="mb-1">
        <label>
          <input
            type="radio"
            name={`q_${question._id}`}
            checked={selectedIndex === idx}
            onChange={() => onSelect(idx)}
          />{' '}
          {a.text}
        </label>
      </div>
    ))}
  </div>
);

export default QuestionCard;