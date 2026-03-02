import React, { useState, useEffect } from 'react';
import data from './aporia_database.json'; // Ensure this file is in the src folder
import './index.css';

function App() {
  // State to track which day the user is on
  const [currentDay, setCurrentDay] = useState(1);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    // Find the entry for the current day in our JSON database
    const todayEntry = data.find(d => d.day === currentDay);
    setEntry(todayEntry || data[0]);
  }, [currentDay]);

  if (!entry) return <div>Loading the examined life...</div>;

  return (
    <div className="aporia-container">
      <header>
        <div className="metadata">Day {entry.day} • Arc {Math.ceil(entry.day / 30)}</div>
        <h1>{entry.title}</h1>
        <h3>{entry.thinker}</h3>
      </header>

      <section className="main-content">
        <blockquote className="seed-quote">
          "{entry.seed}"
        </blockquote>

        <div className="synthesis-section">
          <h4>The Synthesis</h4>
          <p>{entry.synthesis}</p>
        </div>

        <div className="application-box">
          <h4>Today’s Application</h4>
          <p>{entry.application}</p>
        </div>
      </section>

      <section className="navigation">
        <button onClick={() => setCurrentDay(prev => Math.max(1, prev - 1))}>
          Previous Day
        </button>
        <button onClick={() => setCurrentDay(prev => prev + 1)}>
          Next Day
        </button>
      </section>

      <footer style={{marginTop: '50px', fontSize: '0.8rem', opacity: 0.5}}>
        Evidence: {entry.evidence}
      </footer>
    </div>
  );
}

// THIS IS THE LINE THAT FIXES YOUR ERROR:
export default App;