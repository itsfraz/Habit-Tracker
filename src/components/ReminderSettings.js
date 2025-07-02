
import React, { useState } from 'react';

const ReminderSettings = ({ habit, setReminder }) => {
  const [time, setTime] = useState(habit.reminderTime || '');

  const handleSetReminder = () => {
    setReminder(habit.id, time);
  };

  return (
    <div className="input-group mt-2">
      <input
        type="time"
        className="form-control"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button className="btn btn-outline-secondary" onClick={handleSetReminder}>
        Set Reminder
      </button>
    </div>
  );
};

export default ReminderSettings;
