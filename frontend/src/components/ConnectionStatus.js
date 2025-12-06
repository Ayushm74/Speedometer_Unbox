/**
 * Connection Status Component
 * 
 * Displays WebSocket connection status indicator.
 */

import React from 'react';
import './ConnectionStatus.css';

/**
 * Connection status indicator
 * @param {Object} props - Component props
 * @param {boolean} props.isConnected - Connection status
 */
function ConnectionStatus({ isConnected }) {
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      <span className="status-text">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

export default ConnectionStatus;


