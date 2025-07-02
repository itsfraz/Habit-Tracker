
import React from 'react';

const suggestedHabits = [
  { name: 'Drink 8 glasses of water', category: 'Health', frequency: 'daily' },
  { name: 'Read for 30 minutes', category: 'Personal', frequency: 'daily' },
  { name: 'Exercise for 20 minutes', category: 'Health', frequency: 'daily' },
  { name: 'Meditate for 10 minutes', category: 'Personal', frequency: 'daily' },
  { name: 'Plan your day', category: 'Work', frequency: 'daily' },
];

const HabitSuggestions = ({ habits, addHabit, customSuggestedHabits }) => {
  const allSuggestions = [...suggestedHabits, ...customSuggestedHabits];

  const showSuggestions = habits.length < 3; // Show suggestions if less than 3 habits

  if (!showSuggestions) {
    return null;
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Suggested Habits</h5>
        <div className="d-flex flex-wrap">
          {allSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="btn btn-outline-primary btn-sm m-1"
              onClick={() => addHabit(suggestion)}
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitSuggestions;
