/**
 * Speed Chart Component
 * 
 * Displays a line chart showing speed history over time.
 * Uses Recharts library for visualization.
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import './SpeedChart.css';

/**
 * Speed chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of speed data objects
 */
function SpeedChart({ data = [] }) {
  // Format data for chart
  const chartData = data.map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    speed: parseFloat(item.speed),
    index: index,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{`Speed: ${payload[0].value.toFixed(1)} km/h`}</p>
          <p className="tooltip-time">{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="speed-chart-container">
      <h3>Speed History (Last 60 seconds)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#667eea" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            domain={[0, 120]}
            label={{
              value: 'Speed (km/h)',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(255, 255, 255, 0.7)',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="speed"
            stroke="#667eea"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSpeed)"
          />
        </AreaChart>
      </ResponsiveContainer>
      {chartData.length === 0 && (
        <div className="chart-empty">
          <p>No data available yet. Waiting for speed updates...</p>
        </div>
      )}
    </div>
  );
}

export default SpeedChart;


