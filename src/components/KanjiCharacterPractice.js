import React, { useState, useEffect } from 'react';
import { kanjiCharacters } from '../data/words';

function KanjiCharacterPractice() {

  const getRandomKanji = () => {
    const randomIndex = Math.floor(Math.random() * kanjiCharacters.length);
    return kanjiCharacters[randomIndex];
  };

  const initialKanji = getRandomKanji();
  const [currentKanji, setCurrentKanji] = useState(initialKanji);
  const [onyomiInput, setOnyomiInput] = useState(new Array(initialKanji.onyomi.length).fill(''));
  const [kunyomiInput, setKunyomiInput] = useState(new Array(initialKanji.kunyomi.length).fill(''));
  const [isCorrect, setIsCorrect] = useState({ onyomi: null, kunyomi: null });
  const [showingAnswers, setShowingAnswers] = useState(false);

  const getNewKanji = () => {

    setShowingAnswers(true);

    setTimeout(() => {
      setShowingAnswers(false);
      const kanji = getRandomKanji();
      setCurrentKanji(kanji);
      setOnyomiInput(new Array(kanji.onyomi.length).fill(''));
      setKunyomiInput(new Array(kanji.kunyomi.length).fill(''));
      setIsCorrect({ onyomi: null, kunyomi: null });


      setTimeout(() => {
        const firstInput = document.querySelector('.onyomi-inputs input');

        if (firstInput) {
          firstInput.focus();
        }
      }, 10);
    }, 1500);
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

  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  };

  const hasDuplicates = (arr) => {
    const nonEmptyValues = arr.filter(val => val !== '');
    return new Set(nonEmptyValues).size !== nonEmptyValues.length;
  };

  const isValidReading = (input, index, readings, allInputs) => {
    if (!input) return true; // Empty input is valid

    // Get all other inputs except the current one
    const otherInputs = allInputs.filter((_, i) => i !== index).filter(val => val !== '');

    // Check if this reading is already used
    if (otherInputs.includes(input)) return false;

    // Check if this reading is valid
    return readings.includes(input);
  };

  const checkOnyomi = (input) => {
    if (input.every(val => val !== '')) {
      // Check for duplicates first
      if (hasDuplicates(input)) {
        setIsCorrect(prev => ({ ...prev, onyomi: false }));
        return;
      }
      
      // Check if all inputs match the expected readings in any order
      const correct = areArraysEqual(
        input,
        currentKanji.onyomi
      );
      setIsCorrect(prev => ({ ...prev, onyomi: correct }));
    }
  };

  const checkKunyomi = (input) => {
    if (input.every(val => val !== '')) {
      // Check for duplicates first
      if (hasDuplicates(input)) {
        setIsCorrect(prev => ({ ...prev, kunyomi: false }));
        return;
      }

      // Check if all inputs match the expected readings in any order
      const correct = areArraysEqual(
        input,
        currentKanji.kunyomi
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
                  maxLength={currentKanji.onyomi[index].length}
                  value={showingAnswers ? reading : onyomiInput[index]}
                  onChange={(e) => handleInputChange('onyomi', index, e.target.value)}
                  disabled={showingAnswers}
                  className={
                    showingAnswers ? 'correct' :
                    onyomiInput[index]
                      ? isValidReading(onyomiInput[index], index, currentKanji.onyomi, onyomiInput)
                        ? 'correct'
                        : 'incorrect'
                      : ''
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
                  maxLength={currentKanji.kunyomi[index].length}
                  value={showingAnswers ? reading : kunyomiInput[index]}
                  onChange={(e) => handleInputChange('kunyomi', index, e.target.value)}
                  disabled={showingAnswers}
                  className={
                    showingAnswers ? 'correct' :
                    kunyomiInput[index]
                      ? isValidReading(kunyomiInput[index], index, currentKanji.kunyomi, kunyomiInput)
                        ? 'correct'
                        : 'incorrect'
                      : ''
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
        <button onClick={getNewKanji} disabled={showingAnswers}>New Kanji</button>
      </div>
    </div>
  );
}

export default KanjiCharacterPractice;
