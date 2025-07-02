
import React from 'react';

const Badges = ({ earnedBadges }) => {
  return (
    <div className="mt-5">
      <h3>Your Badges</h3>
      {earnedBadges.length === 0 ? (
        <p>No badges earned yet. Keep tracking your habits!</p>
      ) : (
        <div className="d-flex flex-wrap">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="card text-center m-2" style={{ width: '10rem' }}>
              <div className="card-body">
                <i className={`${badge.icon} fs-1 text-warning`}></i>
                <h5 className="card-title mt-2">{badge.name}</h5>
                <p className="card-text">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Badges;
