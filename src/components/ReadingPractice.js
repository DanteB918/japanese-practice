import React, { useState, useEffect } from 'react';

// Sample Japanese words (we can expand this list later)
const japaneseWords = [
  { word: 'かたかな', romaji: ['ka', 'ta', 'ka', 'na'] },
  { word: 'ひらがな', romaji: ['hi', 'ra', 'ga', 'na'] },
  { word: 'やまと', romaji: ['ya', 'ma', 'to'] },
  { word: 'とうきょう', romaji: ['to', 'u', 'kyo', 'u'] },
];

function ReadingPractice() {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    getNewWord();
  }, []);

  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * japaneseWords.length);
    const word = japaneseWords[randomIndex];
    setCurrentWord(word);
    setUserInput(new Array(word.romaji.length).fill(''));
    setIsCorrect(null);

    // Focus the first input after a brief delay to ensure the DOM has updated
    setTimeout(() => {
      const firstInput = document.querySelector('input[type="text"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 10);
  };

  const handleInputChange = (index, value) => {
    const newInput = [...userInput];
    newInput[index] = value.toLowerCase();

    setUserInput(newInput);

    // Check if the current input matches the expected romaji
    if (value.toLowerCase() === currentWord.romaji[index]) {
      // Focus the next input if it exists
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }, 10);
    }

    // Check if the input is correct when all fields are filled
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

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="reading-practice">
      <div className="container">
        <h1>Japanese Word Practice</h1>
        <div className="word-display">
          <h2>{currentWord.word}</h2>
        </div>
        <div className="input-container">
          {currentWord.romaji.map((char, index) => (
            <input
              key={index}
              type="text"
              maxLength={currentWord.romaji[index].length}
              value={userInput[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={
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
        <button onClick={getNewWord}>New Word</button>
      </div>
    </div>
  );
}

export default ReadingPractice;
