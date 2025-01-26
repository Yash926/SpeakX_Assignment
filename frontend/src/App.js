import React, { useState, useEffect, useCallback } from "react"
import { QuestionServiceClient } from "./proto/questions_grpc_web_pb"
import { GetQuestionsRequest, Filters as FiltersProto } from "./proto/questions_pb"
import Header from "./components/Header"
import SearchSection from "./components/SearchSection"
import Filters from "./components/Filters"
import QuestionCard from "./components/QuestionCard"
import Pagination from "./components/Pagination"
import Footer from "./components/Footer"
import NoResults from "./components/NoResults"
import "./App.css"
import { scrollToTop } from "./utils/scroll"
import Loading from "./components/Loading"

const client = new QuestionServiceClient('http://localhost:8080');

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(6) // Removed setPageSize
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    types: [],
  })
  const [questions, setQuestions] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const request = new GetQuestionsRequest();
      request.setPage(currentPage);
      request.setPagesize(pageSize);
      request.setSearch(searchQuery);

      const filters = new FiltersProto();
      filters.setTypesList(selectedFilters.types);
      request.setFilters(filters);

      console.log('Request:', request.toObject()); // Debug log

      const response = await new Promise((resolve, reject) => {
        client.getQuestions(request, {}, (err, response) => {
          if (err) {
            console.error('gRPC Error:', err);
            reject(err);
          }
          console.log('Raw Response:', response.toObject()); // Debug log
          resolve(response);
        });
      });

      const questions = response.getQuestionsList();
      console.log('Processed Questions:', questions.map(q => q.toObject())); // Debug log
      
      setQuestions(questions);
      setTotalPages(response.getTotalpages());
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedFilters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleFilterChange = (newFilters) => {
    console.log('New filters:', newFilters); // Debug log
    setSelectedFilters({
      types: newFilters.types || []
    })
    setCurrentPage(1)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(prev => !prev);
    // Lock body scroll when filter is open
    document.body.style.overflow = !isFilterOpen ? 'hidden' : 'unset';
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
        <SearchSection 
          onFilterToggle={handleFilterToggle} 
          onSearch={handleSearch}
        />
        <div className="content-wrapper">
          <Filters
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
            initialFilters={selectedFilters}
            className="desktop-filters"
          />
          <div className="questions-container">
            <div className="questions-grid">
              {loading ? (
                <Loading />
              ) : questions.length > 0 ? (
                questions.map((question) => (
                  <QuestionCard 
                    key={question.getId()} 
                    {...question.toObject()} 
                  />
                ))
              ) : (
                <NoResults />
              )}
            </div>
            {questions.length > 0 && !loading && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App

