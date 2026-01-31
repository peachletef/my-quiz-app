import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';  // 引入自定义的 CSS

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(""); // 存储反馈信息

  // Fetch the questions from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3001/questions')  // 后端 API 地址
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching questions');
        setLoading(false);
      });
  }, []);

  // 加载中状态
  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  // 错误处理
  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentQuestion = questions.length > 0 ? questions[0].questions[currentIndex] : null;

  const handleOptionClick = (option, index) => {
    setSelectedOption(option);
    setIsAnswered(true);  // 标记已回答
    // 判断用户选择的选项是否正确
    const isCorrect = currentQuestion.answer === String.fromCharCode(65 + index); // A = 65, B = 66, ...
    setFeedback(isCorrect ? 'Correct!' : `Wrong! Correct Answer: ${currentQuestion.answer}`);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions[0].questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);  // 清空上次选择
      setIsAnswered(false);  // 重置回答状态
      setFeedback("");  // 清空反馈信息
    }
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz</h1>
      {currentQuestion && (
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          <div className="options">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = currentQuestion.answer === String.fromCharCode(65 + index); // 判断选项是否正确
              const optionClass = selectedOption
                ? isCorrect && selectedOption === option
                  ? 'correct'  // 正确选项
                  : selectedOption !== option
                  ? 'incorrect'  // 错误选项
                  : ''
                : '';

              return (
                <button
                  key={index}
                  className={`option-button ${optionClass}`}
                  onClick={() => handleOptionClick(option, index)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <div className="answer-feedback">
              {feedback}
            </div>
          )}
          <button className="next-button" onClick={handleNextQuestion} disabled={!isAnswered}>
            下一题
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
