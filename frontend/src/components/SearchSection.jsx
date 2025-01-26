import React from "react"
import { Search, Filter } from "lucide-react"
import "./SearchSection.css"

function SearchSection({ onFilterToggle, onSearch }) {
  return (
    <div className="search-box-wrapper">
      <input 
        type="search" 
        placeholder="Search questions..." 
        className="search-input"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button className="search-btn">
        <Search size={20} />
      </button>
      <button 
        className="filter-btn mobile-only" 
        onClick={onFilterToggle}
        aria-label="Filter"
      >
        <Filter size={18} />
      </button>
    </div>
  )
}

export default SearchSection
