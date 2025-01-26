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
          <h3 className="question-title">{props.title}</h3>
          <div className="question-type">
            {getTypeIcon()}
            {props.type}
          </div>
        </div>
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
