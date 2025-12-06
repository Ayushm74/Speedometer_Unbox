/**
 * Speed Data API Routes
 * 
 * REST API endpoints for speed data operations
 */

const express = require('express');
const router = express.Router();
const speedService = require('../services/speedService');

/**
 * GET /api/speed/latest
 * Get the latest speed data record
 */
router.get('/latest', async (req, res) => {
  try {
    const latest = await speedService.getLatestSpeed();
    if (!latest) {
      return res.status(404).json({ error: 'No speed data available' });
    }
    res.json(latest);
  } catch (error) {
    console.error('Error fetching latest speed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/speed/recent
 * Get recent speed data records
 * Query params: limit (default: 100)
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const speeds = await speedService.getRecentSpeeds(limit);
    res.json(speeds);
  } catch (error) {
    console.error('Error fetching recent speeds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/speed/history
 * Get speed data within a time range
 * Query params: startTime, endTime, limit (default: 1000)
 */
router.get('/history', async (req, res) => {
  try {
    const startTime = req.query.startTime ? new Date(req.query.startTime) : null;
    const endTime = req.query.endTime ? new Date(req.query.endTime) : null;
    const limit = parseInt(req.query.limit) || 1000;

    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Both startTime and endTime query parameters are required' 
      });
    }

    const speeds = await speedService.getSpeedHistory(startTime, endTime, limit);
    res.json(speeds);
  } catch (error) {
    console.error('Error fetching speed history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/speed/statistics
 * Get speed statistics
 * Query params: startTime, endTime (optional)
 */
router.get('/statistics', async (req, res) => {
  try {
    const startTime = req.query.startTime ? new Date(req.query.startTime) : null;
    const endTime = req.query.endTime ? new Date(req.query.endTime) : null;

    const stats = await speedService.getSpeedStatistics(startTime, endTime);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/speed
 * Manually insert a speed data record (for testing)
 * Body: { speed: number, timestamp?: Date }
 */
router.post('/', async (req, res) => {
  try {
    const { speed, timestamp } = req.body;

    if (speed === undefined || speed === null) {
      return res.status(400).json({ error: 'Speed value is required' });
    }

    if (isNaN(speed) || speed < 0) {
      return res.status(400).json({ error: 'Speed must be a non-negative number' });
    }

    const record = await speedService.insertSpeed(
      parseFloat(speed),
      timestamp ? new Date(timestamp) : new Date()
    );

    res.status(201).json(record);
  } catch (error) {
    console.error('Error inserting speed data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


