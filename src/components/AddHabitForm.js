
import React, { useState } from 'react';

const AddHabitForm = ({ addHabit, categories, customSuggestedHabits }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [frequencyType, setFrequencyType] = useState('daily'); // 'daily', 'weekly', 'monthly', 'custom'
  const [customFrequencyCount, setCustomFrequencyCount] = useState(1);
  const [customFrequencyPeriod, setCustomFrequencyPeriod] = useState('week'); // 'week', 'month'
  const [isTimeBased, setIsTimeBased] = useState(false);
  const [targetDuration, setTargetDuration] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      let frequency = frequencyType;
      if (frequencyType === 'custom') {
        frequency = {
          type: 'custom',
          count: customFrequencyCount,
          period: customFrequencyPeriod,
        };
      }
      addHabit({ name, category, frequency, isTimeBased, targetDuration: isTimeBased ? targetDuration : 0 });
      setName('');
      setCategory('');
      setFrequencyType('daily');
      setCustomFrequencyCount(1);
      setCustomFrequencyPeriod('week');
      setIsTimeBased(false);
      setTargetDuration(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new habit..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="form-select"
          value=""
          onChange={(e) => {
            const selectedHabit = customSuggestedHabits.find(habit => habit.name === e.target.value);
            if (selectedHabit) {
              setName(selectedHabit.name);
              setCategory(selectedHabit.category || '');
              setFrequencyType(selectedHabit.frequency || 'daily');
              setIsTimeBased(selectedHabit.isTimeBased || false);
              setTargetDuration(selectedHabit.targetDuration || 0);
            }
          }}
        >
          <option value="">Select a suggested habit</option>
          {customSuggestedHabits.map((habit, index) => (
            <option key={index} value={habit.name}>
              {habit.name}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={frequencyType}
          onChange={(e) => setFrequencyType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
        {frequencyType === 'custom' && (
          <>
            <input
              type="number"
              className="form-control"
              value={customFrequencyCount}
              onChange={(e) => setCustomFrequencyCount(parseInt(e.target.value) || 1)}
              min="1"
            />
            <select
              className="form-select"
              value={customFrequencyPeriod}
              onChange={(e) => setCustomFrequencyPeriod(e.target.value)}
            >
              <option value="week">times/week</option>
              <option value="month">times/month</option>
            </select>
          </>
        )}
        <div className="form-check form-switch ms-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="timeBasedSwitch"
            checked={isTimeBased}
            onChange={(e) => setIsTimeBased(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="timeBasedSwitch">
            Time-based
          </label>
        </div>
        {isTimeBased && (
          <input
            type="number"
            className="form-control ms-2"
            placeholder="Target duration (minutes)"
            value={targetDuration}
            onChange={(e) => setTargetDuration(parseInt(e.target.value) || 0)}
            min="0"
          />
        )}
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm;
