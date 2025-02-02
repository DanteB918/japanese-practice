import React from 'react';
import { Link } from 'react-router-dom';

function MeaningSelection() {
  return (
    <div className="reading-selection">
      <h1>Choose Writing System for Meaning Practice</h1>
      <div className="selection-options">
        <Link to="/meaning-practice/hiragana" className="selection-button">
          Hiragana Practice
        </Link>
        <Link to="/meaning-practice/katakana" className="selection-button">
          Katakana Practice
        </Link>
        <Link to="/meaning-practice/kanji-words" className="selection-button">
          Kanji Words Practice
        </Link>
        <Link to="/meaning-practice/kanji-chars" className="selection-button">
          Kanji Characters Practice
        </Link>
      </div>
    </div>
  );
}

export default MeaningSelection;
