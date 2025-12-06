/**
 * Speed Alert Component
 * 
 * Displays speed alerts when speed exceeds threshold.
 */

import React from 'react';
import './SpeedAlert.css';

/**
 * Speed alert component
 * @param {Object} props - Component props
 * @param {Object} props.alert - Alert data object
 */
function SpeedAlert({ alert }) {
  const time = new Date(alert.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="speed-alert">
      <div className="alert-icon">⚠️</div>
      <div className="alert-content">
        <div className="alert-message">{alert.message}</div>
        <div className="alert-details">
          <span className="alert-speed">{alert.speed.toFixed(1)} km/h</span>
          <span className="alert-time">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default SpeedAlert;


