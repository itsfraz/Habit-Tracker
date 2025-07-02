
import React from 'react';
import ProgressReports from './ProgressReports';
import StreakHeatmap from './StreakHeatmap';
import HabitCompletionChart from './HabitCompletionChart';
import Badges from './Badges';

const Analytics = ({ habits, categories, earnedBadges = [] }) => {
  const calculateHabitSuccessRate = (habit) => {
    if (!habit.history || habit.history.length === 0) {
      return 0;
    }

    const firstTrackedDate = new Date(habit.history[0].date);
    const today = new Date();
    const totalDays = Math.ceil((today - firstTrackedDate) / (1000 * 60 * 60 * 24)) + 1;

    const uniqueDates = new Set(habit.history.map(entry => new Date(entry.date).toDateString()));
    const completedDays = uniqueDates.size;

    return (completedDays / totalDays) * 100;
  };

  const calculateCategorySuccessRate = (categoryName) => {
    const habitsInCategory = habits.filter(habit => habit.category === categoryName);
    if (habitsInCategory.length === 0) {
      return 0;
    }

    const totalSuccessRate = habitsInCategory.reduce((sum, habit) => sum + calculateHabitSuccessRate(habit), 0);
    return totalSuccessRate / habitsInCategory.length;
  };

  return (
    <div className="mt-5">
      <h2>Analytics & Visualization</h2>

      <h3 className="mt-4">Habit Success Rates</h3>
      <ul className="list-group">
        {habits.map((habit) => (
          <li key={habit.id} className="list-group-item d-flex justify-content-between align-items-center">
            {habit.name}
            <span className="badge bg-primary rounded-pill">
              {calculateHabitSuccessRate(habit).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-4">Category Success Rates</h3>
      <ul className="list-group">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
            {category.name}
            <span className="badge bg-success rounded-pill">
              {calculateCategorySuccessRate(category.name).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-4">Habit Completion Over Time</h3>
      {habits.map((habit) => (
        <HabitCompletionChart key={habit.id} habit={habit} />
      ))}

      <h3 className="mt-4">Streak Heatmaps</h3>
      {habits.map((habit) => (
        <StreakHeatmap key={habit.id} habit={habit} />
      ))}

      <ProgressReports habits={habits} />

      <Badges earnedBadges={earnedBadges} />
    </div>
  );
};

export default Analytics;
