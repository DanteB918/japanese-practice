import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReadingPractice from './components/ReadingPractice';
import ReadingSelection from './components/ReadingSelection';
import './App.css';

function Home() {
  return (
    <div className="home">
      <h1>Japanese Learning Practice</h1>
      <div className="practice-options">
        <Link to="/reading-practice" className="practice-button">
          Reading Practice
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reading-practice" element={<ReadingSelection />} />
          <Route path="/reading-practice/:system" element={<ReadingPractice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
