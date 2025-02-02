import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hiraganaMeanings, katakanaMeanings, kanjiWordMeanings, kanjiCharacterMeanings } from '../data/meaning';

function MeaningPractice() {
  const { system } = useParams();

  const getMeaningList = () => {
    switch (system) {
      case 'hiragana':
        return hiraganaMeanings;
      case 'katakana':
        return katakanaMeanings;
      case 'kanji-words':
        return kanjiWordMeanings;
      case 'kanji-chars':
        return kanjiCharacterMeanings;
      default:
        return hiraganaMeanings;
    }
  };

  const getRandomItem = (meaningList) => {
    const randomIndex = Math.floor(Math.random() * meaningList.length);
    return meaningList[randomIndex];
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initialMeaningList = getMeaningList();
  const initialItem = getRandomItem(initialMeaningList);
  const [currentItem, setCurrentItem] = useState(initialItem);
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showingAnswers, setShowingAnswers] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const getSystemTitle = () => {
    switch (system) {
      case 'hiragana':
        return 'Hiragana';
      case 'katakana':
        return 'Katakana';
      case 'kanji-words':
        return 'Kanji Words';
      case 'kanji-chars':
        return 'Kanji Characters';
      default:
        return 'Meaning';
    }
  };

  const generateOptions = (item) => {
    const allOptions = [item.meaning, ...item.distractors];
    return shuffleArray(allOptions);
  };

  useEffect(() => {
    const meaningList = getMeaningList();
    const item = getRandomItem(meaningList);
    setCurrentItem(item);
    setOptions(generateOptions(item));
    setIsCorrect(null);
    setShowingAnswers(false);
    setSelectedOption(null);
    // Reset scores when changing systems
    setCorrectCount(0);
    setTotalAttempts(0);
    setStreak(0);
  }, [system]);

  const handleOptionClick = (selectedOption) => {
    if (showingAnswers) return;
    
    setSelectedOption(selectedOption);
    const correct = selectedOption === currentItem.meaning;
    setIsCorrect(correct);
    setShowingAnswers(true);
    setTotalAttempts(prev => prev + 1);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      const meaningList = getMeaningList();
      const item = getRandomItem(meaningList);
      setCurrentItem(item);
      setOptions(generateOptions(item));
      setIsCorrect(null);
      setShowingAnswers(false);
      setSelectedOption(null);
    }, 1500);
  };

  const getNewWord = () => {
    setShowingAnswers(true);
    setSelectedOption(currentItem.meaning);
    setTotalAttempts(prev => prev + 1);
    setStreak(0);
    
    setTimeout(() => {
      const meaningList = getMeaningList();
      const item = getRandomItem(meaningList);
      setCurrentItem(item);
      setOptions(generateOptions(item));
      setIsCorrect(null);
      setShowingAnswers(false);
      setSelectedOption(null);
    }, 1500);
  };

  const getButtonClass = (option) => {
    if (!showingAnswers) return '';
    if (option === currentItem.meaning) {
      return 'correct';
    }
    if (option === selectedOption && !isCorrect) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <div className="meaning-practice">
      <div className="container">
        <div className="header">
          <h1>{getSystemTitle()} Meaning Practice</h1>
          <div className="score">
            Score: {correctCount}/{totalAttempts} {streak >= 5 && '🔥'}
          </div>
        </div>
        <div className="word-display">
          <h2>{system === 'kanji-chars' ? currentItem.kanji : currentItem.word}</h2>
        </div>
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={showingAnswers}
              className={getButtonClass(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {isCorrect !== null && (
          <div className="feedback">
            {isCorrect ? 'Correct!' : 'Try again!'}
          </div>
        )}
        <button onClick={getNewWord} disabled={showingAnswers}>
          New Word
        </button>
      </div>
    </div>
  );
}

export default MeaningPractice;
