import React, { forwardRef, useEffect } from 'react';
import './NewsItems.css';

const NewsItems = forwardRef(({ title, description, imageUrl, newsUrl, author, date, source, mode, index, isHighlighted }, ref) => {
  useEffect(() => {
    if (isHighlighted && ref.current[index]) {
      ref.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted, index, ref]);

  return (
    <div className={`card ${isHighlighted ? 'highlighted' : ''}`} ref={el => (ref.current[index] = el)}>
      <img src={imageUrl} className="card-img-top" alt={`Image for ${title}`} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        {author && <p className="card-author">By {author}</p>}
        {date && <p className="card-date">Published on: {new Date(date).toLocaleDateString()}</p>}
        {source && <p className="card-source">Source: {source}</p>}
        <a href={newsUrl} className="btn btn-primary">Read more</a>
        <span className="article-number">{index + 1}</span>
      </div>
    </div>
  );
});

export default NewsItems;
