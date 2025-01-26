import React from "react"
import { SearchX } from "lucide-react"
import "./NoResults.css"

function NoResults() {
  return (
    <div className="no-results">
      <SearchX size={48} className="no-results-icon" />
      <h3 className="no-results-title">No Questions Found</h3>
      <p className="no-results-text">
        Try adjusting your search or filters to find what you're looking for
      </p>
    </div>
  )
}

export default NoResults