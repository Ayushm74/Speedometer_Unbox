# Project Structure

## Complete File Structure

```
Unbox_Speedometer/
│
├── backend/                          # Node.js Backend Server
│   ├── config/
│   │   └── database.js              # PostgreSQL connection & configuration
│   ├── db/
│   │   └── migrations/
│   │       └── 001_create_speed_data_table.sql  # Database schema
│   ├── routes/
│   │   └── speedRoutes.js           # REST API endpoints
│   ├── services/
│   │   ├── dataCollector.js         # Background data collection service
│   │   ├── speedGenerator.js        # Speed data simulation
│   │   └── speedService.js          # Database operations
│   ├── .dockerignore                # Docker ignore file
│   ├── .env.example                 # Environment variables template
│   ├── Dockerfile                   # Backend Docker image
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Main server entry point
│
├── frontend/                         # React Frontend Application
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectionStatus.js  # WebSocket status indicator
│   │   │   ├── ConnectionStatus.css
│   │   │   ├── SpeedAlert.js        # Speed alert notifications
│   │   │   ├── SpeedAlert.css
│   │   │   ├── SpeedChart.js        # Historical speed chart
│   │   │   ├── SpeedChart.css
│   │   │   ├── Speedometer.js       # Speed gauge component
│   │   │   └── Speedometer.css
│   │   ├── hooks/
│   │   │   └── useWebSocket.js      # WebSocket connection hook
│   │   ├── App.js                   # Main application component
│   │   ├── App.css                  # Main styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── .dockerignore                # Docker ignore file
│   ├── .env.example                 # Environment variables template
│   ├── Dockerfile                   # Frontend Docker image
│   ├── nginx.conf                   # Nginx configuration
│   └── package.json                 # Frontend dependencies
│
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Docker Compose configuration
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
└── PROJECT_STRUCTURE.md              # This file
```

## Component Overview

### Backend Components

1. **server.js**
   - Main Express server
   - Socket.IO WebSocket server
   - Routes configuration
   - Data collector initialization

2. **config/database.js**
   - PostgreSQL connection pooling
   - Query execution helpers
   - Connection testing

3. **services/speedGenerator.js**
   - Simulates speed sensor data
   - Generates realistic speed values
   - Smooth acceleration/deceleration

4. **services/speedService.js**
   - Database CRUD operations
   - Speed data queries
   - Statistics calculation

5. **services/dataCollector.js**
   - Background service running every second
   - Stores speed data in database
   - Emits WebSocket events
   - Handles speed alerts

6. **routes/speedRoutes.js**
   - REST API endpoints
   - GET /api/speed/latest
   - GET /api/speed/recent
   - GET /api/speed/history
   - GET /api/speed/statistics
   - POST /api/speed

### Frontend Components

1. **App.js**
   - Main application component
   - State management
   - WebSocket event handling
   - Component orchestration

2. **components/Speedometer.js**
   - Circular gauge visualization
   - SVG-based rendering
   - Real-time speed display

3. **components/SpeedChart.js**
   - Historical speed visualization
   - Recharts integration
   - Last 60 seconds of data

4. **components/SpeedAlert.js**
   - Alert notifications
   - Speed threshold violations

5. **components/ConnectionStatus.js**
   - WebSocket connection indicator
   - Visual status feedback

6. **hooks/useWebSocket.js**
   - Custom React hook
   - WebSocket connection management
   - Auto-reconnection handling

## Data Flow

1. **Data Generation**
   ```
   speedGenerator → dataCollector → speedService → PostgreSQL
   ```

2. **Real-Time Updates**
   ```
   dataCollector → WebSocket → Frontend → UI Components
   ```

3. **API Requests**
   ```
   Frontend → REST API → speedService → PostgreSQL → Response
   ```

## Technology Stack

### Backend
- Node.js 18+
- Express.js 4.x
- Socket.IO 4.x
- PostgreSQL (via pg)
- dotenv for configuration

### Frontend
- React 18
- Socket.IO Client
- Recharts for visualization
- Axios for HTTP requests

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 15
- Nginx (for production frontend)

## Key Features Implemented

✅ Real-time speed data collection (every second)  
✅ PostgreSQL database storage  
✅ WebSocket real-time updates  
✅ RESTful API endpoints  
✅ Beautiful speedometer UI  
✅ Historical speed chart  
✅ Speed alerts with configurable threshold  
✅ Statistics dashboard  
✅ Docker containerization  
✅ Complete documentation  

## Environment Variables

### Backend (.env)
- Database connection settings
- Server port configuration
- Speed generation parameters

### Frontend (.env)
- API endpoint URL
- WebSocket server URL

### Docker Compose
- Database credentials
- Service configuration
- Speed generation parameters

## Ports

- **3000**: Frontend (React app)
- **3001**: Backend API & WebSocket
- **5432**: PostgreSQL database

## Database

- **Name**: speedometer_db
- **Table**: speed_data
- **Indexes**: timestamp, created_at
- **Migration**: 001_create_speed_data_table.sql


