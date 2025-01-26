import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Pagination.css"

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="pagination-numbers">
        {currentPage > 2 && (
          <>
            <button onClick={() => onPageChange(1)}>1</button>
            {currentPage > 3 && <span className="pagination-dots">...</span>}
          </>
        )}

        {currentPage > 1 && <button onClick={() => onPageChange(currentPage - 1)}>{currentPage - 1}</button>}

        <button className="active">{currentPage}</button>

        {currentPage < totalPages && <button onClick={() => onPageChange(currentPage + 1)}>{currentPage + 1}</button>}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
            <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}
      </div>

      <button
        className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export default Pagination

