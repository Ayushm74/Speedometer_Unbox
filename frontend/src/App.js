/**
 * Main App Component
 * 
 * This is the root component of the Speedometer application.
 * It manages WebSocket connections and coordinates child components.
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import Speedometer from './components/Speedometer';
import SpeedChart from './components/SpeedChart';
import SpeedAlert from './components/SpeedAlert';
import ConnectionStatus from './components/ConnectionStatus';
import { useWebSocket } from './hooks/useWebSocket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

function App() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [threshold, setThreshold] = useState(100);
  const [statistics, setStatistics] = useState(null);

  // Initialize WebSocket connection
  const { socket, isConnected } = useWebSocket(WS_URL);

  // Handle WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Handle speed updates
    socket.on('speedUpdate', (data) => {
      setCurrentSpeed(parseFloat(data.speed));
      
      // Update speed history (keep last 60 seconds)
      setSpeedHistory((prev) => {
        const newHistory = [...prev, data];
        // Keep only last 60 records (1 minute at 1-second intervals)
        return newHistory.slice(-60);
      });
    });

    // Handle speed alerts
    socket.on('speedAlert', (alertData) => {
      setAlerts((prev) => {
        const newAlert = {
          id: Date.now(),
          ...alertData,
          timestamp: new Date(),
        };
        // Keep only last 5 alerts
        return [newAlert, ...prev].slice(0, 5);
      });
    });

    // Handle threshold updates
    socket.on('thresholdUpdated', (data) => {
      setThreshold(data.threshold);
    });

    // Cleanup on unmount
    return () => {
      socket.off('speedUpdate');
      socket.off('speedAlert');
      socket.off('thresholdUpdated');
    };
  }, [socket]);

  // Fetch initial data and statistics
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch latest speed
        const latestRes = await fetch(`${API_URL}/api/speed/latest`);
        if (latestRes.ok) {
          const latest = await latestRes.json();
          setCurrentSpeed(parseFloat(latest.speed));
        }

        // Fetch recent speeds for chart
        const recentRes = await fetch(`${API_URL}/api/speed/recent?limit=60`);
        if (recentRes.ok) {
          const recent = await recentRes.json();
          setSpeedHistory(recent);
        }

        // Fetch statistics
        const statsRes = await fetch(`${API_URL}/api/speed/statistics`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setStatistics(stats);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    if (isConnected) {
      fetchInitialData();
    }
  }, [isConnected, API_URL]);

  // Update threshold on backend
  const handleThresholdChange = (newThreshold) => {
    setThreshold(newThreshold);
    if (socket && socket.connected) {
      socket.emit('updateThreshold', newThreshold);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Speedometer Dashboard</h1>
        <ConnectionStatus isConnected={isConnected} />
      </header>

      <main className="App-main">
        <div className="dashboard-container">
          {/* Speedometer Display */}
          <div className="speedometer-section">
            <Speedometer speed={currentSpeed} maxSpeed={120} />
            
            {/* Statistics Panel */}
            {statistics && (
              <div className="statistics-panel">
                <h3>Statistics</h3>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Min Speed:</span>
                    <span className="stat-value">{statistics.minSpeed.toFixed(1)} km/h</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Max Speed:</span>
                    <span className="stat-value">{statistics.maxSpeed.toFixed(1)} km/h</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Speed:</span>
                    <span className="stat-value">{statistics.avgSpeed.toFixed(1)} km/h</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Records:</span>
                    <span className="stat-value">{statistics.count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Threshold Control */}
            <div className="threshold-control">
              <label htmlFor="threshold">
                Alert Threshold: {threshold} km/h
              </label>
              <input
                id="threshold"
                type="range"
                min="0"
                max="120"
                value={threshold}
                onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <SpeedChart data={speedHistory} />
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="alerts-section">
            <h2>Speed Alerts</h2>
            <div className="alerts-container">
              {alerts.map((alert) => (
                <SpeedAlert key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;


