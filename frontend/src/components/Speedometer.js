/**
 * Speedometer Component
 * 
 * Displays a circular speedometer gauge showing current speed.
 * Uses SVG for smooth rendering and animations.
 */

import React from 'react';
import './Speedometer.css';

/**
 * Speedometer gauge component
 * @param {Object} props - Component props
 * @param {number} props.speed - Current speed value
 * @param {number} props.maxSpeed - Maximum speed for the gauge (default: 120)
 */
function Speedometer({ speed = 0, maxSpeed = 120 }) {
  // Calculate angle for speed needle (0-240 degrees for gauge arc)
  const angle = Math.min((speed / maxSpeed) * 240, 240);
  const normalizedAngle = angle - 90; // Start from bottom

  // Speed color based on value
  const getSpeedColor = () => {
    const percentage = (speed / maxSpeed) * 100;
    if (percentage < 50) return '#4caf50'; // Green
    if (percentage < 75) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="speedometer-container">
      <div className="speedometer-gauge">
        <svg
          viewBox="0 0 200 200"
          className="speedometer-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gauge background arc */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Gauge fill arc (colored based on speed) */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={getSpeedColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 240) * 502.65} 502.65`}
            transform="rotate(-90 100 100)"
            className="speedometer-fill"
          />

          {/* Speed markers */}
          {[0, 30, 60, 90, 120].map((mark, index) => {
            const markAngle = (mark / maxSpeed) * 240 - 90;
            const x1 = 100 + 70 * Math.cos((markAngle * Math.PI) / 180);
            const y1 = 100 + 70 * Math.sin((markAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((markAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((markAngle * Math.PI) / 180);

            return (
              <g key={index}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="2"
                />
                <text
                  x={100 + 55 * Math.cos((markAngle * Math.PI) / 180)}
                  y={100 + 55 * Math.sin((markAngle * Math.PI) / 180)}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.8)"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {mark}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <g
            transform={`rotate(${normalizedAngle} 100 100)`}
            className="speedometer-needle"
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="40"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill="#fff" />
          </g>
        </svg>

        {/* Speed display */}
        <div className="speed-display">
          <div className="speed-value" style={{ color: getSpeedColor() }}>
            {speed.toFixed(1)}
          </div>
          <div className="speed-unit">km/h</div>
        </div>
      </div>
    </div>
  );
}

export default Speedometer;


