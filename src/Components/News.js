import React, { useState, useEffect, useRef } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import VoiceIntegration from './VoiceIntegration';
import { useNavigate } from 'react-router-dom';

const News = ({ category, pageSize, country, mode }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const articleRefs = useRef([]);

  const navigate = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    const url = `https://newsapi.org/v2/top-headlines?country=US&category=${category}&apiKey=942452faada74fb6a1000f702e8d698d&page=${page}&pageSize=${pageSize}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles);
      setTotalResults(data.totalResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, page, pageSize]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && page < Math.ceil(totalResults / pageSize)) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (highlightedIndex !== null && articleRefs.current[highlightedIndex]) {
      articleRefs.current[highlightedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedIndex]);

  return (
    <div>
      <div className="news-container">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {articles.map((article, index) => (
              <NewsItems
                key={index}
                title={article.title}
                description={article.description}
                imageUrl={article.urlToImage}
                newsUrl={article.url}
                author={article.author}
                date={article.publishedAt}
                source={article.source.name}
                mode={mode}
                index={index}
                ref={articleRefs}
                isHighlighted={highlightedIndex === index}
              />
            ))}

            <VoiceIntegration
              articles={articles}
              onNavigate={navigate}
              mode={mode}
              setHighlightedIndex={setHighlightedIndex}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <div className="pagination-footer">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={page <= 1}
          className="pagination-button"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange('next')}
          disabled={page >= Math.ceil(totalResults / pageSize)}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default News;
