import React, { useState, useEffect } from 'react';
import data from './aporia_database.json';
import './App.css';

function App() {
  // --- CALENDAR LOGIC ---
  const getTargetDay = () => {
    let startDateStr = localStorage.getItem('aporia_start_date');
    if (!startDateStr) {
      // If first time opening the app, set today as Day 1
      startDateStr = new Date().toISOString();
      localStorage.setItem('aporia_start_date', startDateStr);
    }
    const startDate = new Date(startDateStr);
    const today = new Date();
    // Calculate days elapsed
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const target = diffDays + 1; // Start date = Day 1
    
    // Find the closest available day in the database
    const closestEntry = data.reduce((prev, curr) => 
      Math.abs(curr.day - target) < Math.abs(prev.day - target) ? curr : prev
    );
    return closestEntry.day;
  };

  const [currentDay, setCurrentDay] = useState(getTargetDay());
  const [entry, setEntry] = useState(null);
  
  // --- UI STATES ---
  const [showIndex, setShowIndex] = useState(false);
  const [notes, setNotes] = useState('');

  // Update entry and load saved notes when day changes
  useEffect(() => {
    const todayEntry = data.find(d => d.day === currentDay);
    setEntry(todayEntry || data[0]);
    
    // Load local notes for this specific day
    setNotes(localStorage.getItem(`aporia_notes_day_${currentDay}`) || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDay]);

  // Save notes locally as user types
  const handleNoteChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem(`aporia_notes_day_${currentDay}`, e.target.value);
  };

  // --- NAVIGATION LOGIC ---
  const currentIndex = data.findIndex(d => d.day === currentDay);

  const goToNextDay = () => {
    if (currentIndex < data.length - 1) setCurrentDay(data[currentIndex + 1].day);
  };

  const goToPreviousDay = () => {
    if (currentIndex > 0) setCurrentDay(data[currentIndex - 1].day);
  };

  const jumpToDay = (day) => {
    setCurrentDay(day);
    setShowIndex(false);
  };

  // --- GENERATE INDEX ---
  const thinkersMap = {};
  data.forEach(item => {
    if (item.thinker && item.thinker !== "Unknown" && item.thinker !== "The Reader") {
      const names = item.thinker.split(/\s*\+\s*|\s+and\s+/);
      names.forEach(name => {
        const cleanName = name.replace(/\s*\(.*?\)\s*/g, '').trim();
        if (!thinkersMap[cleanName]) thinkersMap[cleanName] = [];
        thinkersMap[cleanName].push(item.day);
      });
    }
  });
  const sortedThinkers = Object.keys(thinkersMap).sort();

  if (!entry) return <div className="loading">Initializing...</div>;

  return (
    <div className="aporia-app">
      <nav className="top-nav">
        <span className="brand">APORIA</span>
        <button className="index-toggle" onClick={() => setShowIndex(!showIndex)}>
          {showIndex ? 'Close Index' : 'Thinkers Index'}
        </button>
      </nav>

      {/* --- INDEX VIEW --- */}
      {showIndex && (
        <div className="index-overlay">
          <h2>Master Index of Thinkers</h2>
          <div className="index-grid">
            {sortedThinkers.map(thinker => (
              <div key={thinker} className="index-item">
                <strong>{thinker}</strong>
                <div className="index-links">
                  {thinkersMap[thinker].map(day => (
                    <button key={day} onClick={() => jumpToDay(day)} className="index-day-btn">
                      Day {day}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN READING VIEW --- */}
      {!showIndex && (
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
                <blockquote className="quote-text">{entry.seed}</blockquote>
              </div>
            )}

            {entry.synthesis && (
              <div className="section-block synthesis">
                <span className="section-label">The Synthesis</span>
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

            {entry.srs_review && (
              <div className="section-block srs-review">
                <span className="section-label">SRS Review</span>
                <div className="action-card" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)' }}>
                  <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.srs_review}</p>
                </div>
              </div>
            )}

            {entry.todays_prompt && (
              <div className="section-block todays-prompt">
                <span className="section-label">Today's Prompt</span>
                <div className="action-card" style={{ borderLeft: '4px solid var(--text-main)', borderRadius: '0 4px 4px 0' }}>
                  <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>{entry.todays_prompt}</p>
                </div>
              </div>
            )}

            {/* --- THE SCRATCHPAD --- */}
            <div className="section-block scratchpad-container">
              <span className="section-label">Personal Scratchpad</span>
              <textarea 
                className="scratchpad" 
                placeholder="Write your actions, responses, or reflections here... (Auto-saves to your browser)"
                value={notes}
                onChange={handleNoteChange}
              />
            </div>
          </section>

          <footer className="entry-footer">
            {entry.evidence && (
              <div className="evidence-note" style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                <strong>Evidence Note:</strong> {entry.evidence}
              </div>
            )}
            <div className="tags">
              {entry.tags && entry.tags.split(' ').filter(t => t).map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </footer>

          <div className="navigation-controls">
            <button onClick={goToPreviousDay} disabled={currentIndex <= 0} className="nav-btn">← Previous</button>
            <div className="progress-text">Entry {currentIndex + 1} of {data.length}</div>
            <button onClick={goToNextDay} disabled={currentIndex >= data.length - 1} className="nav-btn">Next →</button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;