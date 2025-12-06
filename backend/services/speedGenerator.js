/**
 * Speed Data Generator Service
 * 
 * This service simulates speed sensor data generation.
 * It generates realistic speed values with smooth transitions.
 */

class SpeedGenerator {
  constructor(options = {}) {
    // Configuration for speed generation
    this.minSpeed = options.minSpeed || parseFloat(process.env.MIN_SPEED) || 0;
    this.maxSpeed = options.maxSpeed || parseFloat(process.env.MAX_SPEED) || 120;
    this.variation = options.variation || parseFloat(process.env.SPEED_VARIATION) || 5;
    
    // Current speed state
    this.currentSpeed = this.minSpeed;
    
    // Target speed for smooth transitions
    this.targetSpeed = this.minSpeed;
    
    // Speed trend (1 for accelerating, -1 for decelerating)
    this.trend = 1;
    
    // Reset counter for changing trends
    this.stepsUntilChange = Math.floor(Math.random() * 30) + 10;
  }

  /**
   * Generate the next speed value with realistic acceleration/deceleration
   * @returns {number} Speed value in km/h
   */
  generate() {
    // Periodically change trend (accelerate or decelerate)
    this.stepsUntilChange--;
    if (this.stepsUntilChange <= 0) {
      this.trend = Math.random() > 0.5 ? 1 : -1;
      this.stepsUntilChange = Math.floor(Math.random() * 30) + 10;
    }

    // Calculate change amount (smooth acceleration/deceleration)
    const changeAmount = (Math.random() * this.variation + 1) * this.trend;
    
    // Update current speed
    this.currentSpeed += changeAmount;
    
    // Ensure speed stays within bounds
    if (this.currentSpeed > this.maxSpeed) {
      this.currentSpeed = this.maxSpeed;
      this.trend = -1; // Start decelerating
    } else if (this.currentSpeed < this.minSpeed) {
      this.currentSpeed = this.minSpeed;
      this.trend = 1; // Start accelerating
    }
    
    // Add some random variation for realism
    const variation = (Math.random() - 0.5) * 0.5;
    const finalSpeed = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.currentSpeed + variation));
    
    // Round to 2 decimal places
    return Math.round(finalSpeed * 100) / 100;
  }

  /**
   * Generate speed data object with timestamp
   * @returns {Object} Speed data object
   */
  generateData() {
    return {
      speed: this.generate(),
      timestamp: new Date(),
    };
  }

  /**
   * Reset speed generator to initial state
   */
  reset() {
    this.currentSpeed = this.minSpeed;
    this.targetSpeed = this.minSpeed;
    this.trend = 1;
    this.stepsUntilChange = Math.floor(Math.random() * 30) + 10;
  }

  /**
   * Set speed manually (for testing)
   * @param {number} speed - Speed value to set
   */
  setSpeed(speed) {
    this.currentSpeed = Math.max(this.minSpeed, Math.min(this.maxSpeed, speed));
  }
}

module.exports = SpeedGenerator;


