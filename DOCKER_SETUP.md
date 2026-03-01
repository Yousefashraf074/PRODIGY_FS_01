# Full Stack Authentication System - Docker Setup

This Docker Compose configuration includes:

- **MongoDB**: Database service with health checks
- **Backend**: Node.js/Express API server
- **Frontend**: React application

## Services

### MongoDB (mongo)
- Image: mongo:6.0
- Port: 27017
- Username: admin
- Password: password123
- Database: auth_db

### Backend (backend)
- Port: 5000
- Language: Node.js
- Framework: Express.js
- Dependencies: mongoose, bcryptjs, jsonwebtoken

### Frontend (frontend)
- Port: 3000
- Framework: React 18
- Libraries: axios, react-router-dom

## Running the Application

### Prerequisites
- Docker and Docker Compose installed
- Windows PowerShell or CMD

### Build and Run

```powershell
# Navigate to project directory
cd PRODIGY_FS_01

# Build and start all services
docker-compose up --build

# For background execution
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Environment Variables

Backend (.env):
- PORT=5000
- MONGODB_URI=mongodb://admin:password123@mongo:27017/auth_db?authSource=admin
- JWT_SECRET=your_jwt_secret_key_change_in_production
- JWT_EXPIRE=7d
- NODE_ENV=development
- CLIENT_URL=http://localhost:3000

Frontend (.env):
- REACT_APP_API_URL=http://localhost:5000/api

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Admin Routes
- `GET /api/auth/users` - Get all users (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)
- `PUT /api/auth/users/:id/role` - Update user role (admin only)

### Protected Routes
- `GET /api/protected/user-only` - User accessible route
- `GET /api/protected/admin-only` - Admin only route
- `GET /api/protected/moderator-only` - Admin/Moderator route

## Features

✅ Secure user authentication with JWT tokens
✅ Password hashing using bcryptjs
✅ Email validation
✅ Role-based access control (RBAC)
✅ Protected routes
✅ User management dashboard
✅ Full Docker containerization
✅ MongoDB persistence
✅ Development hot reload
✅ Production-ready code structure

## Development Notes

- Backend runs with `nodemon` for auto-reload
- Frontend runs with React development server
- MongoDB persists data in named volume `mongodb_data`
- All services are connected via `auth_network`
- MongoDB includes health checks before backend starts

## Troubleshooting

### MongoDB Connection Error
```
Check if mongo service is healthy:
docker-compose logs mongo
```

### Port Already in Use
```
Change ports in docker-compose.yml:
- "XXXX:5000" (backend)
- "XXXX:3000" (frontend)
- "XXXX:27017" (mongodb)
```

### Clear Everything and Restart
```powershell
docker-compose down -v
docker system prune -a
docker-compose up --build
```
