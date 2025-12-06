/**
 * Speedometer Backend Server
 * 
 * Main server file that sets up Express, WebSocket, and database connections.
 * Handles real-time speed data collection and distribution.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const speedRoutes = require('./routes/speedRoutes');
const dataCollector = require('./services/dataCollector');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dataCollector: dataCollector.getStatus(),
  });
});

// API Routes
app.use('/api/speed', speedRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current status on connection
  socket.emit('status', {
    connected: true,
    dataCollector: dataCollector.getStatus(),
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Handle threshold update
  socket.on('updateThreshold', (threshold) => {
    dataCollector.setSpeedThreshold(threshold);
    io.emit('thresholdUpdated', { threshold });
  });
});

// Set up data collector event listeners
dataCollector.on('speedUpdate', (speedData) => {
  // Broadcast speed update to all connected clients
  io.emit('speedUpdate', speedData);
});

dataCollector.on('speedAlert', (alertData) => {
  // Broadcast speed alert to all connected clients
  io.emit('speedAlert', alertData);
});

dataCollector.on('error', (error) => {
  console.error('Data collector error:', error);
  io.emit('error', { message: 'Data collection error occurred' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await db.testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Initialize database schema
    try {
      const fs = require('fs');
      const path = require('path');
      const migrationSQL = fs.readFileSync(
        path.join(__dirname, 'db/migrations/001_create_speed_data_table.sql'),
        'utf8'
      );
      await db.query(migrationSQL);
      console.log('Database schema initialized successfully');
    } catch (error) {
      // Table might already exist, which is fine
      if (!error.message.includes('already exists')) {
        console.error('Error initializing database schema:', error.message);
      }
    }

    // Start data collector
    dataCollector.start();

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`\n=== Speedometer Backend Server ===`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoints: http://localhost:${PORT}/api/speed`);
      console.log(`WebSocket enabled for real-time updates`);
      console.log(`Data collection: ${dataCollector.isRunning ? 'ACTIVE' : 'INACTIVE'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  dataCollector.stop();
  server.close(() => {
    console.log('HTTP server closed');
    db.pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  dataCollector.stop();
  server.close(() => {
    console.log('HTTP server closed');
    db.pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

// Start the server
startServer();

module.exports = { app, server, io };


