-- Migration: Create speed_data table
-- This table stores time-series speed data with timestamps

-- Create the speed_data table
CREATE TABLE IF NOT EXISTS speed_data (
    id SERIAL PRIMARY KEY,
    speed DECIMAL(5, 2) NOT NULL CHECK (speed >= 0),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on timestamp for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_speed_data_timestamp ON speed_data(timestamp DESC);

-- Create index on created_at for efficient insertion queries
CREATE INDEX IF NOT EXISTS idx_speed_data_created_at ON speed_data(created_at DESC);

-- Add comment to table
COMMENT ON TABLE speed_data IS 'Stores time-series speed measurements recorded every second';
COMMENT ON COLUMN speed_data.speed IS 'Speed value in km/h (0-120 range)';
COMMENT ON COLUMN speed_data.timestamp IS 'Timestamp when the speed was recorded';


