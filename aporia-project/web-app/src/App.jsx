import React, { useState, useEffect } from 'react';
import data from './aporia_database.json';
import './App.css';

function App() {
  // --- CALENDAR LOGIC ---
  const getTargetDay = () => {
    let startDateStr = localStorage.getItem('aporia_start_date');
    if (!startDateStr) {
      startDateStr = new Date().toISOString();
      localStorage.setItem('aporia_start_date', startDateStr);
    }
    const startDate = new Date(startDateStr);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const target = diffDays + 1;
    
    const closestEntry = data.reduce((prev, curr) => 
      Math.abs(curr.day - target) < Math.abs(prev.day - target) ? curr : prev
    );
    return closestEntry.day;
  };

  const [currentDay, setCurrentDay] = useState(getTargetDay());
  const [entry, setEntry] = useState(null);
  
  // --- UI STATES ---
  // currentView can be: 'read', 'index', 'guide'
  const [currentView, setCurrentView] = useState('read');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const todayEntry = data.find(d => d.day === currentDay);
    setEntry(todayEntry || data[0]);
    setNotes(localStorage.getItem(`aporia_notes_day_${currentDay}`) || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDay]);

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem(`aporia_notes_day_${currentDay}`, e.target.value);
  };

  const currentIndex = data.findIndex(d => d.day === currentDay);

  const goToNextDay = () => {
    if (currentIndex < data.length - 1) setCurrentDay(data[currentIndex + 1].day);
  };

  const goToPreviousDay = () => {
    if (currentIndex > 0) setCurrentDay(data[currentIndex - 1].day);
  };

  const jumpToDay = (day) => {
    setCurrentDay(day);
    setCurrentView('read');
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
        <span 
          className="brand" 
          onClick={() => setCurrentView('read')} 
          style={{cursor: 'pointer'}}
          title="Return to today's reading"
        >
          APORIA
        </span>
        <div className="nav-actions">
          <button 
            className={`nav-toggle ${currentView === 'guide' ? 'active' : ''}`} 
            onClick={() => setCurrentView(currentView === 'guide' ? 'read' : 'guide')}
          >
            Guide
          </button>
          <button 
            className={`nav-toggle ${currentView === 'index' ? 'active' : ''}`} 
            onClick={() => setCurrentView(currentView === 'index' ? 'read' : 'index')}
          >
            Index
          </button>
        </div>
      </nav>

      {/* --- GUIDE VIEW --- */}
      {currentView === 'guide' && (
        <div className="guide-view">
          <header className="entry-header" style={{ marginBottom: '2rem' }}>
            <h1 className="entry-title">How to Use Aporia</h1>
            <h2 className="entry-thinker">The Architecture of the Examined Life</h2>
          </header>

          <section className="entry-body">
            <div className="section-block synthesis">
              <span className="section-label">The Project (The Why)</span>
              <p className="body-text">
                Aporia (Greek: ἀπορία) translates to a state of productive confusion—the moment you realize your current maps of reality are insufficient. 
                <br/><br/>
                This is a 365-day philosophical curriculum designed not for passive reading, but for active practice. The core premise is that wisdom is not merely information; it is maintenance. Understanding the argument that you should not be disturbed by what is outside your control is worth nothing if you are still disturbed by it. Aporia provides the daily friction required to turn comprehension into character.
              </p>
            </div>

            <div className="section-block application">
              <span className="section-label">The Anatomy of a Day</span>
              <div className="action-card">
                <p className="body-text">Every day requires roughly 15 minutes of attention, structured as follows:</p>
                <ul className="guide-list">
                  <li><strong>The Seed:</strong> A foundational quote from a primary thinker.</li>
                  <li><strong>The Synthesis:</strong> Contextual framing that connects the historical idea to modern psychological and economic realities.</li>
                  <li><strong>The Application:</strong> A specific, bounded action to perform that day. Do not skip this. The philosophy lives in the execution.</li>
                  <li><strong>Today's Prompt:</strong> A writing prompt designed to expose the gap between what you think you believe and how you actually behave.</li>
                </ul>
              </div>
            </div>

            <div className="section-block srs-review">
              <span className="section-label">The Methodology: Spaced Repetition (SRS)</span>
              <div className="action-card" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)' }}>
                <p className="body-text">
                  Human memory degrades predictably. To counteract this, Aporia utilizes a hard-coded <strong>Spaced Repetition System (SRS)</strong>. 
                  <br/><br/>
                  Throughout the curriculum, you will encounter "SRS Review" blocks prompting you to recall exercises from days or weeks prior. Do not look back at your old notes immediately. Attempt to retrieve the memory cold. The cognitive strain of remembering is exactly what builds the neural pathway. This ensures the concepts accumulate rather than replace one another.
                </p>
              </div>
            </div>

            <div className="section-block seed">
              <span className="section-label">The Interface</span>
              <p className="body-text">
                <strong>The Calendar:</strong> The app tracks your start date. When you return tomorrow, it will automatically place you on the correct day.<br/>
                <strong>The Scratchpad:</strong> The text area at the bottom of the reading view is private. It saves automatically to your browser's local storage. If you clear your browser cache, these notes will disappear. Consider copying critical insights to a permanent analog journal.<br/>
                <strong>The Index:</strong> Use the top navigation to trace specific thinkers across the 12 Arcs of the year.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* --- INDEX VIEW --- */}
      {currentView === 'index' && (
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
      {currentView === 'read' && (
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
                placeholder="Write your actions, responses, or reflections here... (Auto-saves privately to your browser)"
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