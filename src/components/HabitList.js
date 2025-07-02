
import React from 'react';
import Habit from './Habit';

const HabitList = ({ habits, deleteHabit, trackHabit, categories, addNote, setReminder }) => {
  const habitsByCategory = categories.map((category) => ({
    ...category,
    habits: habits.filter((habit) => habit.category === category.name),
  }));

  return (
    <div>
      {habitsByCategory.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.habits.map((habit) => (
            <Habit
              key={habit.id}
              habit={habit}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
              setReminder={setReminder}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default HabitList;
