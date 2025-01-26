import React from "react"
import { Search, Filter } from "lucide-react"
import "./SearchSection.css"

function SearchSection({ onFilterToggle, onSearch }) {
  return (
    <section className="search-section">
      <div className="search-container">
        <h1 className="search-title">📜The Ultimate Question Finder</h1>
        <p className="search-description">Ask smarter. Discover better answers.</p>
        <div className="search-box-wrapper">
          <input 
            type="search" 
            placeholder="Search for questions..." 
            className="search-input"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-btn">
            <Search size={20} />
          </button>
          {/* Make filter button visible only on mobile */}
          <button 
            className="filter-btn mobile-only" 
            onClick={onFilterToggle}
            aria-label="Filter"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default SearchSection
