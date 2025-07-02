
import React, { useState } from 'react';
import HabitCalendar from './HabitCalendar';
import ReminderSettings from './ReminderSettings';

const Habit = ({ habit, deleteHabit, trackHabit, addNote, categories, setReminder }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (typeof habit.frequency === 'object' && habit.frequency.type === 'custom') {
      const { count, period } = habit.frequency;
      let periodStartDate = new Date(today);

      if (period === 'week') {
        periodStartDate.setDate(today.getDate() - today.getDay()); // Start of the current week (Sunday)
      } else if (period === 'month') {
        periodStartDate.setDate(1); // Start of the current month
      }
      periodStartDate.setHours(0, 0, 0, 0);

      const completionsInPeriod = habit.history.filter(entry => {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() >= periodStartDate.getTime() && date.getTime() <= today.getTime();
      }).length;

      return `${completionsInPeriod} / ${count} per ${period}`;

    } else {
      let increment;
      switch (habit.frequency) {
        case 'weekly':
          increment = 7;
          break;
        case 'monthly':
          increment = 30; // Approximation
          break;
        default:
          increment = 1;
      }

      for (let i = habit.history.length - 1; i >= 0; i--) {
        const date = new Date(habit.history[i].date);
        date.setHours(0, 0, 0, 0);

        if (today.getTime() === date.getTime()) {
          streak++;
          today.setDate(today.getDate() - increment);
        } else if (today.getTime() > date.getTime()) {
          break;
        }
      }
    }

    return streak;
  };

  const handleAddNote = () => {
    if (note) {
      addNote(habit.id, note);
      setNote('');
    }
  };

  const isDueTodayAndNotCompleted = () => {
    if (habit.frequency !== 'daily') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletion = habit.history.length > 0
      ? new Date(habit.history[habit.history.length - 1].date)
      : null;

    if (!lastCompletion) return true; // Never completed

    lastCompletion.setHours(0, 0, 0, 0);

    return today.getTime() !== lastCompletion.getTime();
  };

  const categoryColor = categories.find(cat => cat.name === habit.category)?.color || '#6c757d'; // Default to gray if not found

  return (
    <div className={`card mb-3 ${isAnimating ? 'habit-completed' : ''}`} style={{ borderLeft: `5px solid ${categoryColor}` }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{habit.name}</h5>
            <p className="card-text">Streak: {getStreak()}</p>
            {isDueTodayAndNotCompleted() && (
              <p className="text-danger">Due today!</p>
            )}
          </div>
          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => {
                trackHabit(habit.id, habit.isTimeBased ? duration : null);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 500); // Animation duration
              }}
            >
              <i className="bi bi-check-lg"></i>
            </button>
            {habit.isTimeBased && (
              <input
                type="number"
                className="form-control w-25 me-2"
                placeholder="Min"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="0"
              />
            )}
            <button
              className="btn btn-primary me-2"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <i className="bi bi-calendar-event"></i>
            </button>
            <button
              className="btn btn-info me-2"
              onClick={() => setShowReminderSettings(!showReminderSettings)}
            >
              <i className="bi bi-bell"></i>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => deleteHabit(habit.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
        {showCalendar && <HabitCalendar habit={habit} />}
        {showReminderSettings && <ReminderSettings habit={habit} setReminder={setReminder} />}
        <div className="mt-3">
          <h6>Notes</h6>
          <ul className="list-group">
            {habit.notes && habit.notes.map((n) => (
              <li key={n.id} className="list-group-item">
                {n.text}
              </li>
            ))}
          </ul>
          <div className="input-group mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleAddNote}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Habit;
