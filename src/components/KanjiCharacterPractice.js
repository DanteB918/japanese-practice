import React, { useState, useEffect } from 'react';
import { kanjiCharacters } from '../data/words';

function KanjiCharacterPractice() {
  const [currentKanji, setCurrentKanji] = useState(null);
  const [onyomiInput, setOnyomiInput] = useState([]);
  const [kunyomiInput, setKunyomiInput] = useState([]);
  const [isCorrect, setIsCorrect] = useState({ onyomi: null, kunyomi: null });

  useEffect(() => {
    getNewKanji();
  }, []);

  const getNewKanji = () => {
    const randomIndex = Math.floor(Math.random() * kanjiCharacters.length);
    const kanji = kanjiCharacters[randomIndex];
    setCurrentKanji(kanji);
    setOnyomiInput(new Array(kanji.onyomi.length).fill(''));
    setKunyomiInput(new Array(kanji.kunyomi.length).fill(''));
    setIsCorrect({ onyomi: null, kunyomi: null });

    // Focus first Onyomi input
    setTimeout(() => {
      const firstInput = document.querySelector('.onyomi-inputs input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 10);
  };

  const handleInputChange = (type, index, value) => {
    const newInput = type === 'onyomi' 
      ? [...onyomiInput] 
      : [...kunyomiInput];
    newInput[index] = value.toLowerCase();

    if (type === 'onyomi') {
      setOnyomiInput(newInput);
      checkOnyomi(newInput);
    } else {
      setKunyomiInput(newInput);
      checkKunyomi(newInput);
    }
  };

  const checkOnyomi = (input) => {
    if (input.every(val => val !== '')) {
      const correct = input.every((val, i) => 
        val === currentKanji.onyomi[i]
      );
      setIsCorrect(prev => ({ ...prev, onyomi: correct }));
    }
  };

  const checkKunyomi = (input) => {
    if (input.every(val => val !== '')) {
      const correct = input.every((val, i) => 
        val === currentKanji.kunyomi[i]
      );
      setIsCorrect(prev => ({ ...prev, kunyomi: correct }));
    }
  };

  const allCorrect = isCorrect.onyomi && isCorrect.kunyomi;

  useEffect(() => {
    if (allCorrect) {
      setTimeout(() => {
        getNewKanji();
      }, 1000);
    }
  }, [allCorrect]);

  if (!currentKanji) return <div>Loading...</div>;

  return (
    <div className="reading-practice">
      <div className="container">
        <div className="header">
          <h1>Kanji Character Practice</h1>
        </div>
        <div className="kanji-display">
          <h2>{currentKanji.kanji}</h2>
          <p className="kanji-meaning">Meaning: {currentKanji.meaning}</p>
        </div>
        <div className="readings-container">
          <div className="reading-section">
            <h3>Onyomi (音読み)</h3>
            <div className="onyomi-inputs input-container">
              {currentKanji.onyomi.map((reading, index) => (
                <input
                  key={`onyomi-${index}`}
                  type="text"
                  value={onyomiInput[index]}
                  onChange={(e) => handleInputChange('onyomi', index, e.target.value)}
                  className={
                    onyomiInput[index] && (
                      onyomiInput[index] === currentKanji.onyomi[index]
                        ? 'correct'
                        : 'incorrect'
                    )
                  }
                />
              ))}
            </div>
          </div>
          <div className="reading-section">
            <h3>Kunyomi (訓読み)</h3>
            <div className="kunyomi-inputs input-container">
              {currentKanji.kunyomi.map((reading, index) => (
                <input
                  key={`kunyomi-${index}`}
                  type="text"
                  value={kunyomiInput[index]}
                  onChange={(e) => handleInputChange('kunyomi', index, e.target.value)}
                  className={
                    kunyomiInput[index] && (
                      kunyomiInput[index] === currentKanji.kunyomi[index]
                        ? 'correct'
                        : 'incorrect'
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
        {(isCorrect.onyomi !== null || isCorrect.kunyomi !== null) && (
          <div className="feedback">
            {allCorrect ? 'Perfect! All readings correct!' : 'Keep trying!'}
          </div>
        )}
        <button onClick={getNewKanji}>New Kanji</button>
      </div>
    </div>
  );
}

export default KanjiCharacterPractice;
