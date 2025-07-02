
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const StreakHeatmap = ({ habit }) => {
  const today = new Date();
  const endDate = today;
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const values = habit.history.map((entry) => ({
    date: new Date(entry.date),
    count: 1,
  }));

  return (
    <div className="mt-3">
      <h6>{habit.name} Streak Heatmap</h6>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-1`;
        }}
      />
    </div>
  );
};

export default StreakHeatmap;
