/**
 * Speed Data Service
 * 
 * This service handles all database operations related to speed data.
 * It provides methods for inserting, retrieving, and querying speed records.
 */

const db = require('../config/database');

class SpeedService {
  /**
   * Insert a new speed data record
   * @param {number} speed - Speed value in km/h
   * @param {Date} timestamp - Timestamp of the measurement
   * @returns {Promise<Object>} Inserted record
   */
  async insertSpeed(speed, timestamp = new Date()) {
    const queryText = `
      INSERT INTO speed_data (speed, timestamp)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [speed, timestamp];
    const result = await db.query(queryText, values);
    return result.rows[0];
  }

  /**
   * Get the latest speed data record
   * @returns {Promise<Object|null>} Latest speed record or null
   */
  async getLatestSpeed() {
    const queryText = `
      SELECT * FROM speed_data
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    
    const result = await db.query(queryText);
    return result.rows[0] || null;
  }

  /**
   * Get speed data within a time range
   * @param {Date} startTime - Start timestamp
   * @param {Date} endTime - End timestamp
   * @param {number} limit - Maximum number of records (default: 1000)
   * @returns {Promise<Array>} Array of speed records
   */
  async getSpeedHistory(startTime, endTime, limit = 1000) {
    const queryText = `
      SELECT * FROM speed_data
      WHERE timestamp >= $1 AND timestamp <= $2
      ORDER BY timestamp DESC
      LIMIT $3
    `;
    
    const values = [startTime, endTime, limit];
    const result = await db.query(queryText, values);
    return result.rows;
  }

  /**
   * Get recent speed data records
   * @param {number} limit - Number of recent records to retrieve (default: 100)
   * @returns {Promise<Array>} Array of recent speed records
   */
  async getRecentSpeeds(limit = 100) {
    const queryText = `
      SELECT * FROM speed_data
      ORDER BY timestamp DESC
      LIMIT $1
    `;
    
    const values = [limit];
    const result = await db.query(queryText, values);
    return result.rows.reverse(); // Return in chronological order
  }

  /**
   * Get speed statistics
   * @param {Date} startTime - Start timestamp (optional)
   * @param {Date} endTime - End timestamp (optional)
   * @returns {Promise<Object>} Statistics object with min, max, avg, count
   */
  async getSpeedStatistics(startTime = null, endTime = null) {
    let queryText;
    let values;
    
    if (startTime && endTime) {
      queryText = `
        SELECT 
          COUNT(*) as count,
          MIN(speed) as min_speed,
          MAX(speed) as max_speed,
          AVG(speed) as avg_speed
        FROM speed_data
        WHERE timestamp >= $1 AND timestamp <= $2
      `;
      values = [startTime, endTime];
    } else {
      queryText = `
        SELECT 
          COUNT(*) as count,
          MIN(speed) as min_speed,
          MAX(speed) as max_speed,
          AVG(speed) as avg_speed
        FROM speed_data
      `;
      values = [];
    }
    
    const result = await db.query(queryText, values);
    const stats = result.rows[0];
    
    return {
      count: parseInt(stats.count),
      minSpeed: parseFloat(stats.min_speed || 0),
      maxSpeed: parseFloat(stats.max_speed || 0),
      avgSpeed: parseFloat(stats.avg_speed || 0),
    };
  }

  /**
   * Delete old speed data (cleanup function)
   * @param {Date} beforeDate - Delete records before this date
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteOldData(beforeDate) {
    const queryText = `
      DELETE FROM speed_data
      WHERE timestamp < $1
      RETURNING id
    `;
    
    const values = [beforeDate];
    const result = await db.query(queryText, values);
    return result.rowCount;
  }
}

module.exports = new SpeedService();


