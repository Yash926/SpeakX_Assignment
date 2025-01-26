import React from "react"
import "./Loading.css"

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <svg viewBox="0 0 50 50" className="spinner">
            <circle 
              cx="25" 
              cy="25" 
              r="20" 
              fill="none" 
              strokeWidth="4"
            />
          </svg>
        </div>
        <p className="loading-text">Loading questions...</p>
      </div>
    </div>
  )
}

export default Loading