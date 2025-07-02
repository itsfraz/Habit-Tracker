
import React from 'react';
import HabitList from './HabitList';
import Analytics from './Analytics';

const Dashboard = ({ habits, categories, deleteHabit, trackHabit, addNote, layout }) => {
  return (
    <div className="dashboard-layout">
      {layout === 'default' && (
        <div className="row">
          <div className="col-md-6">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
          <div className="col-md-6">
            <Analytics habits={habits} categories={categories} />
          </div>
        </div>
      )}
      {layout === 'analytics-first' && (
        <div className="row">
          <div className="col-md-6">
            <Analytics habits={habits} categories={categories} />
          </div>
          <div className="col-md-6">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
        </div>
      )}
      {layout === 'full-width-habits' && (
        <div className="row">
          <div className="col-12">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
          <div className="col-12">
            <Analytics habits={habits} categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
