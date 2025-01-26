import React, { useState } from "react";
import { FileQuestion, Mic, Book, MessageSquare } from "lucide-react";
import "./QuestionCard.css";
import QuestionDetails from "./QuestionDetails";

function QuestionCard(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [initialShuffledBlocks] = useState(() => {
    if (props.type === 'ANAGRAM') {
      return [...(props.blocksList || [])].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  const renderContent = () => {
    switch (props.type) {
      case 'ANAGRAM':
        return (
          <div className="preview-container">
            <div className="anagram-preview">
              <p className="anagram-type">
                {props.anagramtype === 'WORD' ? 'Rearrange the letters' : 'Rearrange the words'}
              </p>
              <div className="anagram-blocks">
                {initialShuffledBlocks.map((block, index) => (
                  <div 
                    key={index} 
                    className="anagram-block"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {block.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="preview-overlay" />
          </div>
        );
      
      case 'MCQ':
        return (
          <div className="preview-container">
            <div className="mcq-preview">
              {props.optionsList.map((option, index) => (
                <div key={index} className="mcq-option-preview">
                  {option.text}
                </div>
              ))}
            </div>
            <div className="preview-overlay" />
          </div>
        );

      case 'READ_ALONG':
        return (
          <div className="preview-container">
            <div className="read-along-preview">
              <Mic className="read-along-icon" size={24} />
              <p className="read-along-text">{props.title}</p>
            </div>
            <div className="preview-overlay" />
          </div>
        );

      case 'CONTENT_ONLY':
        return (
          <div className="preview-container">
            <div className="content-preview">
              <MessageSquare className="content-icon" size={24} />
              <p className="content-text">{props.title}</p>
            </div>
            <div className="preview-overlay" />
          </div>
        );

      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (props.type) {
      case 'READ_ALONG':
        return <Mic size={16} />;
      case 'CONTENT_ONLY':
        return <Book size={16} />;
      default:
        return <FileQuestion size={16} />;
    }
  };

  return (
    <>
      <article 
        className="question-card"
        onClick={() => setShowDetails(true)}
      >
        <div className="question-header">
          <div className="question-type">
            {getTypeIcon()}
            {props.type}
          </div>
        </div>

        <h3 className="question-title">{props.title}</h3>
        {renderContent()}
        
        <button 
          className="view-details"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(true);
          }}
        >
          View Details
        </button>
      </article>

      <QuestionDetails
        question={{...props, initialShuffledBlocks}}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}

export default QuestionCard;
