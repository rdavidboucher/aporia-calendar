import React, { useState, useEffect } from 'react';
import data from './aporia_database.json';
import './App.css';

function App() {
  // We initialize with the first day available in your data, 
  // rather than assuming Day 1 exists.
  const [currentDay, setCurrentDay] = useState(data[0]?.day || 1);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    // Find the specific entry for the current day
    const todayEntry = data.find(d => d.day === currentDay);
    setEntry(todayEntry || data[0]);
    
    // Smooth scroll to top when changing days
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDay]);

  // Navigation Logic: Jumps to the next/prev index in the array
  const currentIndex = data.findIndex(d => d.day === currentDay);

  const goToNextDay = () => {
    if (currentIndex < data.length - 1) {
      setCurrentDay(data[currentIndex + 1].day);
    }
  };

  const goToPreviousDay = () => {
    if (currentIndex > 0) {
      setCurrentDay(data[currentIndex - 1].day);
    }
  };

  if (!entry) return <div className="loading">Initializing the examined life...</div>;

  return (
    <div className="aporia-app">
      <nav className="top-nav">
        <span className="brand">APORIA</span>
        <span className="arc-label">Arc {Math.ceil(entry.day / 30)}: {getArcTheme(entry.day)}</span>
      </nav>

      <main className="content-container">
        <header className="entry-header">
          <div className="day-badge">Day {entry.day}</div>
          <h1 className="entry-title">{entry.title}</h1>
          <h2 className="entry-thinker">{entry.thinker}</h2>
        </header>

        <section className="entry-body">
          <div className="section-block seed">
            <span className="section-label">The Seed</span>
            <blockquote className="quote-text">
              {entry.seed}
            </blockquote>
          </div>

          <div className="section-block synthesis">
            <span className="section-label">The Synthesis</span>
            <p className="body-text">{entry.synthesis}</p>
          </div>

          <div className="section-block application">
            <span className="section-label">The Application</span>
            <div className="action-card">
              <p className="body-text">{entry.application}</p>
            </div>
          </div>
        </section>

        <footer className="entry-footer">
          <div className="evidence-note">
            <strong>Evidence Note:</strong> {entry.evidence}
          </div>
          <div className="tags">
            {entry.tags.split(' ').map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </footer>

        <div className="navigation-controls">
          <button 
            onClick={goToPreviousDay} 
            disabled={currentIndex === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <div className="progress-text">
            Entry {currentIndex + 1} of {data.length}
          </div>

          <button 
            onClick={goToNextDay} 
            disabled={currentIndex === data.length - 1}
            className="nav-btn"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}

// Helper to show Arc themes based on day ranges
function getArcTheme(day) {
  if (day <= 30) return "Foundation of Attention";
  if (day <= 60) return "Architecture of Self";
  if (day <= 90) return "The World As It Is";
  return "Continuous Practice";
}

export default App;