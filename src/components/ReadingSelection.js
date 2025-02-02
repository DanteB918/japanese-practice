import React from 'react';
import { Link } from 'react-router-dom';

function ReadingSelection() {
  return (
    <div className="reading-selection">
      <h1>Choose Writing System</h1>
      <div className="selection-options">
        <Link to="/reading-practice/hiragana" className="selection-button">
          Hiragana Practice
        </Link>
        <Link to="/reading-practice/katakana" className="selection-button">
          Katakana Practice
        </Link>
      </div>
    </div>
  );
}

export default ReadingSelection;
