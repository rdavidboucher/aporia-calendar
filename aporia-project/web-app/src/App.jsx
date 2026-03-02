import React, { useState, useEffect } from 'react';
import data from './aporia_database.json';
import './App.css';

function App() {
  // Initialize with the first available day in the database
  const [currentDay, setCurrentDay] = useState(data[0]?.day || 1);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    // Find the entry for the current day
    const todayEntry = data.find(d => d.day === currentDay);
    setEntry(todayEntry || data[0]);
    
    // Smooth scroll to top when changing days
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDay]);

  // Smart Navigation Logic: Jumps to the actual next available entry, skipping gaps
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
          {entry.seed && (
            <div className="section-block seed">
              <span className="section-label">The Seed</span>
              <blockquote className="quote-text">
                {entry.seed}
              </blockquote>
            </div>
          )}

          {entry.synthesis && (
            <div className="section-block synthesis">
              <span className="section-label">The Synthesis</span>
              {/* whiteSpace pre-wrap respects paragraph breaks from the text file */}
              <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.synthesis}</p>
            </div>
          )}

          {entry.application && (
            <div className="section-block application">
              <span className="section-label">The Application</span>
              <div className="action-card">
                <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.application}</p>
              </div>
            </div>
          )}

          {/* NEW: SRS Review Block */}
          {entry.srs_review && (
            <div className="section-block srs-review">
              <span className="section-label">SRS Review</span>
              <div className="action-card" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)' }}>
                <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.srs_review}</p>
              </div>
            </div>
          )}

          {/* NEW: Today's Prompt Block */}
          {entry.todays_prompt && (
            <div className="section-block todays-prompt">
              <span className="section-label">Today's Prompt</span>
              <div className="action-card" style={{ borderLeft: '4px solid var(--text-main)', borderRadius: '0 4px 4px 0' }}>
                <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.todays_prompt}</p>
              </div>
            </div>
          )}
        </section>

        <footer className="entry-footer">
          {entry.evidence && (
            <div className="evidence-note" style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              <strong>Evidence Note:</strong> {entry.evidence}
            </div>
          )}
          
          <div className="tags">
            {entry.tags && entry.tags.split(' ').filter(t => t).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </footer>

        <div className="navigation-controls">
          <button 
            onClick={goToPreviousDay} 
            disabled={currentIndex <= 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <div className="progress-text" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Entry {currentIndex + 1} of {data.length}
          </div>

          <button 
            onClick={goToNextDay} 
            disabled={currentIndex >= data.length - 1}
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
  if (day <= 120) return "The Obstacle";
  if (day <= 150) return "The Other";
  if (day <= 180) return "The Work";
  if (day <= 210) return "The Body";
  if (day <= 240) return "The Meaning";
  if (day <= 270) return "The Time";
  if (day <= 300) return "The Surrender";
  if (day <= 330) return "The Integration";
  return "The Examined Life";
}

export default App;