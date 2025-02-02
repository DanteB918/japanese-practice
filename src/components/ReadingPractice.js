import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hiraganaWords, katakanaWords, kanjiWords } from '../data/reading';

function ReadingPractice() {
  const { system } = useParams();
  
  const getWordList = () => {
    switch (system) {
      case 'hiragana':
        return hiraganaWords;
      case 'katakana':
        return katakanaWords;
      case 'kanji-words':
        return kanjiWords;
      default:
        return hiraganaWords;
    }
  };

  const getRandomWord = (wordList) => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const word = wordList[randomIndex];
    return word;
  };

  const initialWordList = getWordList();
  const initialWord = getRandomWord(initialWordList);
  const [currentWord, setCurrentWord] = useState(initialWord);
  const [userInput, setUserInput] = useState(new Array(initialWord.romaji.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(null);
  const [showingAnswers, setShowingAnswers] = useState(false);
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
      default:
        return 'Reading';
    }
  };

  useEffect(() => {
    const wordList = getWordList();
    const word = getRandomWord(wordList);
    setCurrentWord(word);
    setUserInput(new Array(word.romaji.length).fill(''));
    setIsCorrect(null);
    setShowingAnswers(false);
    // Reset scores when changing systems
    setCorrectCount(0);
    setTotalAttempts(0);
    setStreak(0);
  }, [system]);

  const handleInputChange = (index, value) => {
    const newInput = [...userInput];
    newInput[index] = value.toLowerCase();
    setUserInput(newInput);

    // Move to next input box if current input is correct
    if (value.toLowerCase() === currentWord.romaji[index]) {
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }, 10);
    }

    // Check if all inputs are filled AND match the expected length
    const allInputsFilled = newInput.every((input, i) => 
      input.length === currentWord.romaji[i].length
    );

    if (allInputsFilled) {
      const correct = newInput.every((input, i) => 
        input === currentWord.romaji[i]
      );
      
      setIsCorrect(correct);
      setTotalAttempts(prev => prev + 1);
      
      if (correct) {
        setShowingAnswers(true);
        setCorrectCount(prev => prev + 1);
        setStreak(prev => prev + 1);
        
        setTimeout(() => {
          const wordList = getWordList();
          const word = getRandomWord(wordList);
          setCurrentWord(word);
          setUserInput(new Array(word.romaji.length).fill(''));
          setIsCorrect(null);
          setShowingAnswers(false);

          setTimeout(() => {
            const firstInput = document.querySelector('input[type="text"]');
            if (firstInput) {
              firstInput.focus();
            }
          }, 10);
        }, 1500);
      } else {
        setStreak(0);
      }
    }
  };

  const getNewWord = () => {
    setShowingAnswers(true);
    setTotalAttempts(prev => prev + 1);
    setStreak(0);
    
    setTimeout(() => {
      const wordList = getWordList();
      const word = getRandomWord(wordList);
      setCurrentWord(word);
      setUserInput(new Array(word.romaji.length).fill(''));
      setIsCorrect(null);
      setShowingAnswers(false);

      setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
          firstInput.focus();
        }
      }, 10);
    }, 1500);
  };

  return (
    <div className="reading-practice">
      <div className="container">
        <div className="header">
          <h1>{getSystemTitle()} Reading Practice</h1>
          <div className="score">
            Score: {correctCount}/{totalAttempts} {streak >= 5 && '🔥'}
          </div>
        </div>
        <div className="word-display">
          {system === 'kanji-chars' ? (
            <h2>{currentWord.kanji}</h2>
          ) : (
            <h2>{currentWord.word}</h2>
          )}
          {system === 'kanji-words' && currentWord.meaning && (
            <p className="word-meaning">Meaning: {currentWord.meaning}</p>
          )}
        </div>
        <div className="input-container">
          {system === 'kanji-chars' ? (
            <input
              type="text"
              value={showingAnswers ? currentWord.onyomi.join(', ') : userInput[0]}
              onChange={(e) => handleInputChange(0, e.target.value)}
              disabled={showingAnswers}
              className={
                showingAnswers ? 'correct' :
                userInput[0] && (
                  userInput[0] === currentWord.onyomi[0]
                    ? 'correct'
                    : 'incorrect'
                )
              }
            />
          ) : (
            currentWord.romaji.map((char, index) => (
              <input
                key={index}
                type="text"
                maxLength={currentWord.romaji[index].length}
                value={showingAnswers ? char : userInput[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={showingAnswers}
                className={
                  showingAnswers ? 'correct' :
                  userInput[index] && (
                    userInput[index] === currentWord.romaji[index]
                      ? 'correct'
                      : 'incorrect'
                  )
                }
              />
            ))
          )}
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

export default ReadingPractice;
