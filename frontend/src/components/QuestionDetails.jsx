import React, { useState, useEffect, useMemo } from "react";
import { X, Check, AlertTriangle } from "lucide-react";
import "./QuestionDetails.css";

function QuestionDetails({ question, isOpen, onClose }) {
  const questionData = useMemo(() => ({
    blocks: question?.blocksList || [],
    options: question?.optionsList || [],
    type: question?.type || '',
    title: question?.title || '',
    anagramType: question?.anagramtype || '',
    solution: question?.solution || '',
    initialShuffledBlocks: question?.initialShuffledBlocks || []
  }), [question]);

  // States
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [attempts, setAttempts] = useState(0);

  // Reset states and use shuffled blocks
  useEffect(() => {
    if (questionData.type === "ANAGRAM") {
      setShuffledBlocks(questionData.initialShuffledBlocks);
    }
    setSelectedBlocks([]);
    setSelectedOption(null);
    setAttempts(0);
    setIsCorrect(null);
    setShowSolution(false);
  }, [questionData]); // Include all dependencies

  // Handle body scroll lock
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const handleAnagramBlockClick = (index) => {
    if (showSolution) return;

    setSelectedBlocks(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];

      // Get answer based on selection order
      const answer = newSelection
        .map(selectedIndex => shuffledBlocks[selectedIndex].text)
        .join(questionData.anagramType === "WORD" ? "" : " ");

      // Check if answer matches solution
      const isAnswerCorrect = answer.toLowerCase().trim() === questionData.solution.toLowerCase().trim();
      
      if (isAnswerCorrect) {
        setIsCorrect(true);
      } else if (newSelection.length === questionData.blocks.length) {
        setIsCorrect(false);
        setShowSolution(true);
      }

      return newSelection;
    });
  };

  const handleMCQOptionSelect = (option) => {
    if (showSolution) return;
    
    setSelectedOption(option);
    setAttempts(prev => prev + 1);
    
    const isAnswerCorrect = option.iscorrectanswer;
    setIsCorrect(isAnswerCorrect);
    
    if (!isAnswerCorrect && attempts >= 0) {
      setShowSolution(true);
    }
  };

  const handleSolutionClick = () => {
    if (!showSolution && !isCorrect) {
      setShowConfirmDialog(true);
    }
  };

  const renderAnagram = () => (
    <div className="anagram-question">
      <div className="anagram-instructions">
        {questionData.anagramType === "WORD" 
          ? "Click the letters in the order to form the word" 
          : "Click the words in the order to form the sentence"}
      </div>
      <div className="blocks-container">
        {shuffledBlocks.map((block, index) => (
          <button
            key={index}
            className={`anagram-block ${
              selectedBlocks.includes(index) 
                ? `selected order-${selectedBlocks.indexOf(index) + 1}` 
                : ''
            }`}
            onClick={() => handleAnagramBlockClick(index)}
            disabled={showSolution}
          >
            {block.text}
            {selectedBlocks.includes(index) && (
              <span className="selection-order">
                {selectedBlocks.indexOf(index) + 1}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="answer-preview">
        {selectedBlocks.length > 0 
          ? selectedBlocks
              .map(index => shuffledBlocks[index].text)
              .join(questionData.anagramType === "WORD" ? "" : " ")
          : "Your answer will appear here"}
      </div>
    </div>
  );

  const renderMCQ = () => (
    <div className="mcq-question">
      <div className="mcq-options">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            className={`mcq-option ${
              selectedOption === option 
                ? option.iscorrectanswer ? 'correct' : 'incorrect'
                : ''
            }`}
            onClick={() => handleMCQOptionSelect(option)}
            disabled={showSolution}
          >
            <span className="option-text">{option.text}</span>
            {selectedOption === option && (
              <span className="option-feedback">
                {option.iscorrectanswer ? '✓' : '✗'}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {isCorrect === false && attempts > 0 && !showSolution && (
        <div className="mcq-feedback">
          Try again! One more incorrect attempt will reveal the solution.
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (questionData.type) {
      case "ANAGRAM":
        return renderAnagram();
      case "MCQ":
        return renderMCQ();
      case "READ_ALONG":
        return (
          <div className="read-along">
            <div className="content">{questionData.title}</div>
            <div className="practice-prompt">
              Practice reading this aloud to improve pronunciation
            </div>
          </div>
        );
      case "CONTENT_ONLY":
        return (
          <div className="content-only">
            <div className="content">{questionData.title}</div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFeedback = () => {
    if (isCorrect === true) {
      return (
        <div className="feedback-message success">
          <Check className="feedback-icon" />
          <div className="feedback-content">
            <h4>Excellent work!</h4>
            <p>You've got the correct answer</p>
          </div>
        </div>
      );
    }

    if (isCorrect === false) {
      return (
        <div className="feedback-message error">
          <AlertTriangle className="feedback-icon" />
          <div className="feedback-content">
            <h4>Keep trying!</h4>
            <p>That's not quite right</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderActions = () => {
    if (isCorrect !== true && ["ANAGRAM", "MCQ"].includes(questionData.type) && !showSolution) {
      return (
        <div className="actions">
          <button 
            className="solution-btn" 
            onClick={handleSolutionClick}
          >
            Show Solution
          </button>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="question-details-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-content">
          <h2 className="question-title">{questionData.title}</h2>
          
          {renderContent()}
          {renderFeedback()}
          {renderActions()}

          {showSolution && (
            <div className="solution">
              <h3>Solution:</h3>
              <p>{questionData.solution || questionData.options.find(opt => opt.iscorrectanswer)?.text}</p>
            </div>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <h3>Are you sure?</h3>
            <p>Do you want to see the solution without trying first?</p>
            <div className="confirm-actions">
              <button onClick={() => setShowConfirmDialog(false)}>
                No, I'll try first
              </button>
              <button onClick={() => {
                setShowConfirmDialog(false);
                setShowSolution(true);
              }}>
                Yes, show solution
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionDetails;