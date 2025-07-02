
import React from 'react';

const ProgressReports = ({ habits }) => {
  const getMonthlyReport = () => {
    const monthlyData = {};
    habits.forEach(habit => {
      habit.history.forEach(entry => {
        const date = new Date(entry.date);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthlyData[yearMonth]) {
          monthlyData[yearMonth] = {};
        }
        if (!monthlyData[yearMonth][habit.name]) {
          monthlyData[yearMonth][habit.name] = 0;
        }
        monthlyData[yearMonth][habit.name]++;
      });
    });
    return monthlyData;
  };

  const getYearlyReport = () => {
    const yearlyData = {};
    habits.forEach(habit => {
      habit.history.forEach(entry => {
        const date = new Date(entry.date);
        const year = date.getFullYear().toString();
        if (!yearlyData[year]) {
          yearlyData[year] = {};
        }
        if (!yearlyData[year][habit.name]) {
          yearlyData[year][habit.name] = 0;
        }
        yearlyData[year][habit.name]++;
      });
    });
    return yearlyData;
  };

  const monthlyReport = getMonthlyReport();
  const yearlyReport = getYearlyReport();

  return (
    <div className="mt-5">
      <h3>Monthly Progress Reports</h3>
      {Object.keys(monthlyReport).sort().map(month => (
        <div key={month} className="card mb-3">
          <div className="card-header">{month}</div>
          <ul className="list-group list-group-flush">
            {Object.keys(monthlyReport[month]).map(habitName => (
              <li key={habitName} className="list-group-item d-flex justify-content-between align-items-center">
                {habitName}
                <span className="badge bg-info rounded-pill">{monthlyReport[month][habitName]} completions</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="mt-4">Yearly Progress Reports</h3>
      {Object.keys(yearlyReport).sort().map(year => (
        <div key={year} className="card mb-3">
          <div className="card-header">{year}</div>
          <ul className="list-group list-group-flush">
            {Object.keys(yearlyReport[year]).map(habitName => (
              <li key={habitName} className="list-group-item d-flex justify-content-between align-items-center">
                {habitName}
                <span className="badge bg-info rounded-pill">{yearlyReport[year][habitName]} completions</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProgressReports;
