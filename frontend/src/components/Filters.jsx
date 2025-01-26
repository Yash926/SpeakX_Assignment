import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import "./Filters.css"

function Filters({ isOpen, onClose, onFilterChange, initialFilters = {}, className = "" }) {
  const [filters, setFilters] = useState({
    types: initialFilters.types || [],
  })

  const QUESTION_TYPES = [
    { id: "MCQ", label: "Multiple Choice" },
    { id: "ANAGRAM", label: "Anagram" },
    { id: "READ_ALONG", label: "Read Along" },
    { id: "CONTENT_ONLY", label: "Content Only" }
  ]

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  // Cleanup effect for body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <div 
        className={`filter-overlay ${isOpen ? "active" : ""}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`filters ${isOpen ? "active" : ""} ${className}`}>
        <div className="filters-header">
          <h2 className="filters-title">Filters</h2>
          <button 
            className="filters-close" 
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-group">
          <h3 className="filter-heading">Question Type</h3>
          <div className="filter-options">
            {QUESTION_TYPES.map(({ id, label }) => (
              <label key={id} className="filter-option">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={filters.types.includes(id)}
                  onChange={() => handleFilterChange("types", id)}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Filters
