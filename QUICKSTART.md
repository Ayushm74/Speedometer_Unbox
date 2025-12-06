# Quick Start Guide

## Using Docker (Recommended)

### 1. Start the Application
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Backend API server (port 3001)
- Frontend React app (port 3000)

### 2. Access the Application
- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 4. Stop the Application
```bash
docker-compose down
```

### 5. Reset Everything (Clean Slate)
```bash
docker-compose down -v
docker-compose up -d
```

## Local Development (Without Docker)

### Backend

1. Install PostgreSQL and create database:
   ```bash
   createdb speedometer_db
   psql speedometer_db < backend/db/migrations/001_create_speed_data_table.sql
   ```

2. Navigate to backend and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Start backend:
   ```bash
   npm start
   # Or for development: npm run dev
   ```

### Frontend

1. Navigate to frontend and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start frontend:
   ```bash
   npm start
   ```

The app will open at http://localhost:3000

## Testing the Application

1. **Check Backend**: Visit http://localhost:3001/health
2. **Check API**: Visit http://localhost:3001/api/speed/latest
3. **Check Frontend**: Visit http://localhost:3000

The speedometer should start updating every second automatically!

## Troubleshooting

### Port Already in Use
If ports 3000, 3001, or 5432 are already in use:
- Change ports in `docker-compose.yml` OR
- Stop the conflicting services

### Database Connection Errors
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Wait a few seconds for database to initialize

### Frontend Can't Connect to Backend
- Verify backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Ensure environment variables are set correctly

## Default Credentials

- **Database**: speedometer_db
- **User**: speedometer_user
- **Password**: speedometer_password

These can be changed via environment variables.


