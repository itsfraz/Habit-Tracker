
import React, { useState, useEffect, useRef } from 'react';
import HabitList from './components/HabitList';
import AddHabitForm from './components/AddHabitForm';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import MotivationalQuote from './components/MotivationalQuote';
import Badges from './components/Badges';
import LevelDisplay from './components/LevelDisplay';
import ShareProgress from './components/ShareProgress';
import HabitSuggestions from './components/HabitSuggestions';
import DataManagement from './components/DataManagement';

const App = () => {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Health', color: '#28a745' }, // Green
    { id: 2, name: 'Work', color: '#007bff' },   // Blue
    { id: 3, name: 'Personal', color: '#ffc107' }, // Yellow
    { id: 4, name: 'Skill Development', color: '#fd7e14' }, // Orange
    { id: 5, name: 'Uncategorized', color: '#6c757d' }, // Gray
  ]);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('habits');
  const [layout, setLayout] = useState('default');
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const layoutDropdownRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [newSuggestedHabitName, setNewSuggestedHabitName] = useState('');
  const [customSuggestedHabits, setCustomSuggestedHabits] = useState([]);
  const XP_PER_LEVEL = 100;

  const allBadges = [
    { id: 1, name: 'First Step', description: 'Track your first habit', icon: 'bi bi-award-fill', condition: (habits) => habits.some(habit => habit.history.length > 0) },
    { id: 2, name: 'Consistent Beginner', description: 'Track a habit for 7 consecutive days', icon: 'bi bi-star-fill', condition: (habits) => habits.some(habit => {
        if (habit.history.length < 7) return false;
        let streak = 0;
        let lastDate = null;
        for (let i = habit.history.length - 1; i >= 0; i--) {
          const currentDate = new Date(habit.history[i].date);
          currentDate.setHours(0, 0, 0, 0);
          if (lastDate && (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
            streak++;
          } else if (!lastDate || (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
            streak = 1;
          }
          lastDate = currentDate;
          if (streak >= 7) return true;
        }
        return false;
      })
    },
    { id: 3, name: 'Habit Master', description: 'Track 5 different habits', icon: 'bi bi-trophy-fill', condition: (habits) => habits.filter(habit => habit.history.length > 0).length >= 5 },
  ];

  const calculateEarnedBadges = (habits) => {
    return allBadges.filter(badge => badge.condition(habits));
  };

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem('habits'));
    if (storedHabits) {
      const habitsWithParsedDates = storedHabits.map(habit => ({
        ...habit,
        history: habit.history.map(entry => ({
          ...entry,
          date: new Date(entry.date)
        }))
      }));
      setHabits(habitsWithParsedDates);
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const storedLevel = parseInt(localStorage.getItem('level')) || 1;
    const storedXp = parseInt(localStorage.getItem('xp')) || 0;
    setLevel(storedLevel);
    setXp(storedXp);

    const storedCustomSuggestions = JSON.parse(localStorage.getItem('customSuggestedHabits'));
    if (storedCustomSuggestions) {
      setCustomSuggestedHabits(storedCustomSuggestions);
    }

    if (!('Notification' in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleClickOutside = (event) => {
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target)) {
        setIsLayoutDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('theme', theme);
    localStorage.setItem('level', level);
    localStorage.setItem('xp', xp);
    localStorage.setItem('customSuggestedHabits', JSON.stringify(customSuggestedHabits));
    document.body.className = theme === 'dark' ? 'bg-dark text-white' : '';

    // Clear existing reminders
    habits.forEach(habit => {
      if (habit.reminderTimeoutId) {
        clearTimeout(habit.reminderTimeoutId);
      }
    });

    // Schedule new reminders
    habits.forEach(habit => {
      if (habit.reminderTime) {
        const [hours, minutes] = habit.reminderTime.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        if (reminderDate.getTime() < now.getTime()) {
          // If reminder time is in the past for today, schedule for tomorrow
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        const delay = reminderDate.getTime() - now.getTime();

        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            if (Notification.permission === "granted") {
              const notification = new Notification('Habit Reminder', {
                body: `Time to ${habit.name}!`, 
                icon: '/logo192.png',
                data: { habitId: habit.id, reminderTime: habit.reminderTime }
              });

              notification.onclick = () => {
                // Focus the tab if clicked
                window.focus();
              };

              // Add snooze functionality (example: snooze for 10 minutes)
              notification.onclose = (event) => {
                if (event.isTrusted) { // Check if user closed the notification
                  const snoozedTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
                  const snoozedHours = snoozedTime.getHours().toString().padStart(2, '0');
                  const snoozedMinutes = snoozedTime.getMinutes().toString().padStart(2, '0');
                  setReminder(habit.id, `${snoozedHours}:${snoozedMinutes}`);
                }
              };
            }
          }, delay);

          setHabits(prevHabits => prevHabits.map(h => 
            h.id === habit.id ? { ...h, reminderTimeoutId: timeoutId } : h
          ));
        }
      }
    });
  }, [habits, theme, level, xp]);

  const addHabit = (habit) => {
    setHabits([
      ...habits,
      { ...habit, id: Date.now(), history: [], notes: [], frequency: habit.frequency, isTimeBased: habit.isTimeBased, targetDuration: habit.targetDuration, reminderTime: null },
    ]);
  };

  const setReminder = (id, time) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, reminderTime: time }
          : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const trackHabit = (id, duration = null) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, history: [...habit.history, { date: new Date().toISOString(), duration: duration }] }
          : habit
      )
    );
    setXp(prevXp => {
      const newXp = prevXp + 10; // Award 10 XP per completion
      if (newXp >= XP_PER_LEVEL) {
        setLevel(prevLevel => prevLevel + 1);
        return newXp - XP_PER_LEVEL;
      }
      return newXp;
    });
  };

  const addNote = (id, note) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, notes: [...habit.notes, { id: Date.now(), text: note }] }
          : habit
      )
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addCustomSuggestedHabit = (habitName) => {
    if (habitName.trim() !== '') {
      setCustomSuggestedHabits(prev => [...prev, { name: habitName.trim(), category: 'Uncategorized', frequency: 'daily' }]);
    }
  };

  const removeCustomSuggestedHabit = (index) => {
    setCustomSuggestedHabits(prev => prev.filter((_, i) => i !== index));
  };

  

  return (
    <div className={`container mt-5 ${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Habit Tracker</h1>
        <button className="btn btn-secondary" onClick={toggleTheme}>
          <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}`}></i>
        </button>
      </div>

      <MotivationalQuote />

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            Habits
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item dropdown" ref={layoutDropdownRef}>
          <button
            className="nav-link dropdown-toggle"
            onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
            aria-expanded={isLayoutDropdownOpen}
          >
            Layout
          </button>
          <ul className={`dropdown-menu ${isLayoutDropdownOpen ? 'show' : ''}`}>
            <li>
              <a className="dropdown-item" href="#" onClick={() => {
                setLayout('default');
                setIsLayoutDropdownOpen(false);
              }}>
                Default
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={() => {
                setLayout('analytics-first');
                setIsLayoutDropdownOpen(false);
              }}>
                Analytics First
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={() => {
                setLayout('full-width-habits');
                setIsLayoutDropdownOpen(false);
              }}>
                Full Width Habits
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </li>
      </ul>

      {activeTab === 'habits' && (
        <>
          <AddHabitForm addHabit={addHabit} categories={categories} customSuggestedHabits={customSuggestedHabits} />
          <HabitSuggestions habits={habits} addHabit={addHabit} categories={categories} customSuggestedHabits={customSuggestedHabits} />
          <HabitList
            habits={habits}
            deleteHabit={deleteHabit}
            trackHabit={trackHabit}
            addNote={addNote}
            categories={categories}
            setReminder={setReminder}
          />
        </>
      )}

      {activeTab === 'analytics' && (
        <Analytics habits={habits} categories={categories} earnedBadges={calculateEarnedBadges(habits)} />
      )}

      {activeTab === 'analytics' && (
        <LevelDisplay level={level} xp={xp} XP_PER_LEVEL={XP_PER_LEVEL} />
      )}

      {activeTab === 'analytics' && (
        <ShareProgress habits={habits} level={level} />
      )}

      {activeTab === 'dashboard' && (
        <Dashboard
          habits={habits}
          categories={categories}
          deleteHabit={deleteHabit}
          trackHabit={trackHabit}
          addNote={addNote}
          layout={layout}
        />
      )}

      {activeTab === 'data' && (
        <DataManagement
          habits={habits}
          categories={categories}
          setHabits={setHabits}
          customSuggestedHabits={customSuggestedHabits}
          addCustomSuggestedHabit={addCustomSuggestedHabit}
          removeCustomSuggestedHabit={removeCustomSuggestedHabit}
        />
      )}
    </div>
  );
};

export default App;
