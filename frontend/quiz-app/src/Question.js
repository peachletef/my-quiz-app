import React, { useState } from 'react';

function Question({ question }) {
  const { question: questionText, options, answer } = question;
  const [selectedOption, setSelectedOption] = useState('');

  // Handle selecting an option
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Check answer
  const isCorrect = selectedOption === answer;

  return (
    <div className="question">
      <h3>{questionText}</h3>
      <div className="options">
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={`question-${questionText}`}
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}
      </div>
      <div className="result">
        {selectedOption && (
          <p>{isCorrect ? 'Correct Answer!' : `Wrong Answer. Correct: ${answer}`}</p>
        )}
      </div>
    </div>
  );
}

export default Question;
