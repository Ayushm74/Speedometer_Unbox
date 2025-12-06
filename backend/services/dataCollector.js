/**
 * Data Collector Service
 * 
 * This service continuously generates and stores speed data every second.
 * It runs as a background process and emits events for real-time updates.
 */

const EventEmitter = require('events');
const SpeedGenerator = require('./speedGenerator');
const speedService = require('./speedService');

class DataCollector extends EventEmitter {
  constructor() {
    super();
    this.generator = new SpeedGenerator();
    this.intervalId = null;
    this.isRunning = false;
    this.speedThreshold = 100; // Alert threshold in km/h
  }

  /**
   * Start collecting and storing speed data every second
   */
  start() {
    if (this.isRunning) {
      console.log('Data collector is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting data collector...');

    // Collect data immediately, then every second
    this.collectData();
    this.intervalId = setInterval(() => {
      this.collectData();
    }, 1000);
  }

  /**
   * Stop collecting speed data
   */
  stop() {
    if (!this.isRunning) {
      console.log('Data collector is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    console.log('Data collector stopped');
  }

  /**
   * Collect a single speed data point and store it
   */
  async collectData() {
    try {
      // Generate speed data
      const speedData = this.generator.generateData();
      
      // Store in database
      const storedData = await speedService.insertSpeed(
        speedData.speed,
        speedData.timestamp
      );

      // Emit event for real-time updates
      this.emit('speedUpdate', storedData);

      // Check for speed threshold alert
      if (speedData.speed > this.speedThreshold) {
        this.emit('speedAlert', {
          speed: speedData.speed,
          timestamp: speedData.timestamp,
          message: `Speed exceeded threshold of ${this.speedThreshold} km/h`,
        });
      }

      console.log(`Speed recorded: ${speedData.speed} km/h at ${speedData.timestamp.toISOString()}`);
    } catch (error) {
      console.error('Error collecting speed data:', error);
      this.emit('error', error);
    }
  }

  /**
   * Set speed alert threshold
   * @param {number} threshold - Speed threshold in km/h
   */
  setSpeedThreshold(threshold) {
    this.speedThreshold = threshold;
  }

  /**
   * Get current status
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentSpeed: this.generator.currentSpeed,
      threshold: this.speedThreshold,
    };
  }
}

module.exports = new DataCollector();


