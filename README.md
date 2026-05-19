# Speedometer - Real-Time Speed Monitoring Application

A full-stack application that records time-series speed data every second, stores it in a PostgreSQL database, and displays real-time speed updates on a React UI using WebSockets.
## Features
\
- **Real-Time Speed Monitoring**: Updates every second via WebSocket 
- **Data Persistence**: Stores all speed data in PostgreSQL database
- **Beautiful UI**: Modern, responsive speedometer gauge with historical charts
- **Speed Alerts**: Configurable threshold alerts for speed violations
- **Statistics Dashboard**: Min, max, average speed and total record count
- **Dockerized**: Complete Docker Compose setup for easy deployment
- **RESTful API**: Comprehensive API endpoints for speed data operations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.IO** for WebSocket communication
- **PostgreSQL** for data storage
- **pg** for database connection pooling

### Frontend
- **React 18** with functional components and hooks
- **Socket.IO Client** for real-time updates
- **Recharts** for data visualization
- **CSS3** for modern, responsive styling

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** for serving React production build

## Project Structure

```
Unbox_Speedometer/
├── backend/                 # Node.js backend server
│   ├── config/             # Database configuration
│   ├── db/                 # Database migrations
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend Docker image
│
├── frontend/               # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   ├── package.json        # Frontend dependencies
│   ├── Dockerfile          # Frontend Docker image
│   └── nginx.conf          # Nginx configuration
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # This file
```

## Prerequisites

- **Docker** and **Docker Compose** (recommended)
- OR **Node.js** 18+ and **PostgreSQL** 12+ for local development

## Quick Start with Docker (Recommended)

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Create environment file** (optional, defaults work out of the box):
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Start all services** with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

5. **View logs**:
   ```bash
   docker-compose logs -f
   ```

6. **Stop all services**:
   ```bash
   docker-compose down
   ```

7. **Stop and remove volumes** (clean slate):
   ```bash
   docker-compose down -v
   ```

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials if needed.

4. **Set up PostgreSQL database**:
   ```bash
   # Create database (adjust credentials as needed)
   createdb speedometer_db
   psql speedometer_db < db/migrations/001_create_speed_data_table.sql
   ```

5. **Start the backend server**:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

The backend will start on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if your backend is running on a different URL.

4. **Start the development server**:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### REST API

All endpoints are prefixed with `/api/speed`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/speed/latest` | Get the latest speed record |
| GET | `/api/speed/recent?limit=100` | Get recent speed records |
| GET | `/api/speed/history?startTime=...&endTime=...` | Get speed data in time range |
| GET | `/api/speed/statistics?startTime=...&endTime=...` | Get speed statistics |
| POST | `/api/speed` | Manually insert speed data (for testing) |
| GET | `/health` | Health check endpoint |

### WebSocket Events

#### Client → Server
- `updateThreshold` - Update speed alert threshold

#### Server → Client
- `speedUpdate` - New speed data (emitted every second)
- `speedAlert` - Speed threshold exceeded
- `status` - Connection status
- `thresholdUpdated` - Threshold has been updated

## Configuration

### Environment Variables

#### Backend (.env)
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=speedometer_db
DB_USER=speedometer_user
DB_PASSWORD=speedometer_password
PORT=3001
NODE_ENV=development
MIN_SPEED=0
MAX_SPEED=120
SPEED_VARIATION=5
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=http://localhost:3001
```

#### Docker Compose
You can override defaults by creating a `.env` file in the root directory:
```env
DB_NAME=speedometer_db
DB_USER=speedometer_user
DB_PASSWORD=speedometer_password
MIN_SPEED=0
MAX_SPEED=120
SPEED_VARIATION=5
```

## Database Schema

### speed_data Table
```sql
CREATE TABLE speed_data (
    id SERIAL PRIMARY KEY,
    speed DECIMAL(5, 2) NOT NULL CHECK (speed >= 0),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Features Breakdown

### Real-Time Updates
- Speed data is generated every second by the backend
- Data is stored in PostgreSQL database
- WebSocket broadcasts updates to all connected clients
- Frontend receives and displays updates instantly

### Speedometer Gauge
- Circular gauge showing current speed (0-120 km/h)
- Color-coded based on speed level (green → orange → red)
- Smooth animations and transitions
- Needle rotates based on speed value

### Historical Chart
- Line chart showing speed history for last 60 seconds
- Updates in real-time as new data arrives
- Tooltips showing exact values and timestamps

### Speed Alerts
- Configurable threshold (default: 100 km/h)
- Visual alerts when threshold is exceeded
- Alert history displayed in the UI
- Threshold can be adjusted in real-time

### Statistics Panel
- Minimum speed
- Maximum speed
- Average speed
- Total number of records

## Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Structure

#### Backend Services
- **speedGenerator.js**: Simulates speed sensor data generation
- **speedService.js**: Database operations for speed data
- **dataCollector.js**: Background service that collects and stores data every second

#### Frontend Components
- **Speedometer.js**: Circular gauge display
- **SpeedChart.js**: Historical speed visualization
- **SpeedAlert.js**: Alert notification component
- **ConnectionStatus.js**: WebSocket connection indicator

### Building for Production

#### Backend
```bash
cd backend
npm install --production
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Build output is in frontend/build/
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify network connectivity if using Docker

### WebSocket Connection Failed
- Check if backend is running on the correct port
- Verify CORS settings in `backend/server.js`
- Check browser console for connection errors

### Frontend Not Loading
- Ensure frontend build completed successfully
- Check nginx configuration if using Docker
- Verify environment variables are set correctly

### No Speed Data Appearing
- Check backend logs for errors
- Verify data collector is running
- Check database connection and schema

## Performance Considerations

- Database uses indexed columns for efficient queries
- Connection pooling for optimal database performance
- Frontend limits history to last 60 records for chart performance
- WebSocket updates are efficient with minimal data transfer

## Security Notes

- Use environment variables for sensitive data (passwords, keys)
- Production deployment should use HTTPS
- Consider adding authentication/authorization for production
- Implement rate limiting on API endpoints for production

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Multiple speed sensors support
- [ ] Export speed data to CSV/JSON
- [ ] Advanced filtering and search
- [ ] Mobile app support
- [ ] Email/SMS notifications for alerts
- [ ] Machine learning for speed prediction

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the repository.


