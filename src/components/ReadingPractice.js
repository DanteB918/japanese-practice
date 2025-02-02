import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hiraganaWords, katakanaWords, kanjiWords } from '../data/words';

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
  }, [system]);

  const getNewWord = () => {
    setShowingAnswers(true);

    setTimeout(() => {
      setShowingAnswers(false);
      const wordList = getWordList();
      const word = getRandomWord(wordList);
      setCurrentWord(word);
      setUserInput(new Array(word.romaji.length).fill(''));
      setIsCorrect(null);

      setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
          firstInput.focus();
        }
      }, 10);
    }, 1500);
  };

  const handleInputChange = (index, value) => {
    const newInput = [...userInput];
    newInput[index] = value.toLowerCase();

    setUserInput(newInput);

    if (value.toLowerCase() === currentWord.romaji[index]) {
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }, 10);
    }

    if (newInput.every(input => input !== '')) {
      const correct = newInput.every((input, i) => input === currentWord.romaji[i]);
      setIsCorrect(correct);

      if (correct) {
        setTimeout(() => {
          getNewWord();
        }, 1000);
      }
    }
  };

  return (
    <div className="reading-practice">
      <div className="container">
        <div className="header">
          <h1>{getSystemTitle()} Practice</h1>
        </div>
        <div className="word-display">
          <h2>{currentWord.word}</h2>
          {system === 'kanji-words' && currentWord.meaning && (
            <p className="word-meaning">Meaning: {currentWord.meaning}</p>
          )}
        </div>
        <div className="input-container">
          {currentWord.romaji.map((char, index) => (
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
          ))}
        </div>
        {isCorrect !== null && (
          <div className="feedback">
            {isCorrect ? 'Correct!' : 'Try again!'}
          </div>
        )}
        <button onClick={getNewWord} disabled={showingAnswers}>New Word</button>
      </div>
    </div>
  );
}

export default ReadingPractice;
