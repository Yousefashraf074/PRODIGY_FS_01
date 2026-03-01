# Secure User Authentication System

A complete, production-ready full-stack authentication system with secure login, registration, and role-based access control.

## 🚀 Features

### Security
- ✅ **Bcrypt Password Hashing**: Industry-standard password hashing with salt rounds
- ✅ **JWT Authentication**: Stateless token-based authentication
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **CORS Configuration**: Secure cross-origin requests
- ✅ **Input Validation**: Express validator for input sanitization

### Authentication
- ✅ **User Registration**: Secure account creation with email validation
- ✅ **User Login**: Secure authentication with JWT token generation
- ✅ **Session Management**: Token-based session handling
- ✅ **Token Expiration**: Configurable JWT expiry (default 7 days)

### Authorization
- ✅ **Role-Based Access Control**: User, Admin, and Moderator roles
- ✅ **Protected Endpoints**: Middleware to verify authentication
- ✅ **Role-Based Middleware**: Authorization by user role
- ✅ **Admin Panel**: User management interface

### User Management
- ✅ **User Profile**: View and update user information
- ✅ **User CRUD**: Create, read, update, delete operations
- ✅ **Role Management**: Admin can assign/modify user roles
- ✅ **User Dashboard**: Personalized user interface

### Technical
- ✅ **Docker Containerization**: Full stack containerized
- ✅ **Docker Compose**: Multi-service orchestration
- ✅ **MongoDB**: NoSQL database with persistence
- ✅ **Express.js**: Lightweight Node.js framework
- ✅ **React**: Modern frontend framework
- ✅ **API Architecture**: RESTful API design

## 📁 Project Structure

```
PRODIGY_FS_01/
├── backend/
│   ├── models/
│   │   └── User.js                 # User schema with password hashing
│   ├── controllers/
│   │   └── authController.js       # Authentication logic
│   ├── middleware/
│   │   └── auth.js                 # JWT verification & authorization
│   ├── routes/
│   │   ├── auth.js                 # Auth endpoints
│   │   └── protected.js            # Protected routes
│   ├── server.js                   # Express server setup
│   ├── package.json                # Backend dependencies
│   ├── Dockerfile                  # Backend container
│   └── .env.example                # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js            # Login form component
│   │   │   ├── Register.js         # Registration form component
│   │   │   └── ProtectedRoute.js   # Route protection wrapper
│   │   ├── pages/
│   │   │   ├── Home.js             # Landing page
│   │   │   └── Dashboard.js        # User dashboard
│   │   ├── services/
│   │   │   └── api.js              # API client & interceptors
│   │   ├── styles/
│   │   │   ├── Auth.css            # Auth component styles
│   │   │   ├── Dashboard.css       # Dashboard styles
│   │   │   └── Home.css            # Home page styles
│   │   ├── App.js                  # Main App component
│   │   └── index.js                # React entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── Dockerfile                  # Frontend container
│   └── .env.example                # Environment template
│
├── docker-compose.yml              # Docker Compose configuration
├── DOCKER_SETUP.md                 # Docker setup instructions
└── README.md                        # This file
```

## 🔧 Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Bcryptjs**: Password hashing
- **JSON Web Tokens (JWT)**: Authentication
- **Express Validator**: Input validation
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Styling

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nodemon**: Auto-reload for development

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git (optional)
- Windows PowerShell or CMD

### Installation & Running

1. **Navigate to project directory**
   ```powershell
   cd PRODIGY_FS_01
   ```

2. **Build and start all services**
   ```powershell
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **Create test account**
   - Go to Register page
   - Fill in details and create account
   - You'll be automatically logged in

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Doe"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/auth/users
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "count": 5,
  "users": [ ... ]
}
```

#### Delete User
```http
DELETE /api/auth/users/{userId}
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Update User Role
```http
PUT /api/auth/users/{userId}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}

Response (200):
{
  "success": true,
  "message": "User role updated successfully",
  "user": { ... }
}
```

### Protected Routes

#### User-Only Route
```http
GET /api/protected/user-only
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "This is a protected user route",
  "userId": "..."
}
```

#### Admin-Only Route
```http
GET /api/protected/admin-only
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "This is an admin-only route",
  "user": { ... }
}
```

#### Moderator Route
```http
GET /api/protected/moderator-only
Authorization: Bearer {moderator_or_admin_token}

Response (200):
{
  "success": true,
  "message": "This route is accessible to admin and moderators",
  "user": { ... }
}
```

## 🔐 Security Features

### Password Security
- **Bcryptjs**: Industry-standard hashing algorithm
- **Salt Rounds**: 10 (configurable)
- **Comparison**: Safe password comparison using bcrypt

### Token Security
- **JWT**: Stateless token-based authentication
- **Secret Key**: Configurable secret for signing tokens
- **Expiration**: Default 7 days, configurable
- **Bearer Token**: Standard authorization header format

### Input Validation
- **Email Validation**: RFC-compliant email format
- **Password Requirements**: Minimum 6 characters
- **Type Checking**: Mongoose schema validation
- **Sanitization**: Input trimming and cleaning

### Authorization
- **Middleware Protection**: All protected routes use auth middleware
- **Role-Based Access**: Route-level role checking
- **Token Verification**: JWT signature verification on each request

## 🐳 Docker Commands

```powershell
# Build and start services
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Stop services
docker-compose down

# Remove volumes (database data)
docker-compose down -v

# Rebuild specific service
docker-compose build backend --no-cache

# Execute command in container
docker-compose exec backend npm run dev
docker-compose exec mongo mongosh
```

## 🧪 Testing the System

### 1. Register New User
- Open http://localhost:3000/register
- Fill in details
- Submit form

### 2. Login
- Open http://localhost:3000/login
- Enter credentials
- Access dashboard

### 3. View Profile
- Dashboard shows user information
- Current role and permissions displayed

### 4. Test Protected Routes (via API)
```powershell
# Get token from login
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test protected route
curl -H "Authorization: Bearer $token" http://localhost:5000/api/protected/user-only

# Test admin route (will fail if user role is not admin)
curl -H "Authorization: Bearer $token" http://localhost:5000/api/protected/admin-only
```

## 🛠️ Configuration

### Backend Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongo:27017/auth_db?authSource=admin
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 User Roles

### User Role
- Access personal profile
- View own user information
- Update own profile
- Access `/api/protected/user-only` route

### Moderator Role
- All user permissions
- Access moderator routes
- Access `/api/protected/moderator-only` route

### Admin Role
- All permissions
- Manage all users
- View all users
- Delete users
- Assign/modify user roles
- Access admin routes

## 🐛 Troubleshooting

### MongoDB Connection Issues
```powershell
# Check MongoDB container logs
docker-compose logs mongo

# Verify MongoDB is healthy
docker-compose ps mongo
```

### Backend Connection Error
```powershell
# Check backend logs
docker-compose logs backend

# Verify backend service
docker-compose ps backend
```

### CORS Errors
```
Ensure REACT_APP_API_URL environment variable is set correctly
Update CLIENT_URL in backend .env file
```

### Port Conflicts
Edit docker-compose.yml and change port mappings:
```yaml
backend:
  ports:
    - "5001:5000"  # Change external port

frontend:
  ports:
    - "3001:3000"  # Change external port
```

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction)
- [Bcryptjs NPM](https://www.npmjs.com/package/bcryptjs)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Created as a comprehensive full-stack authentication solution.

---

**Ready to deploy?** Follow the Quick Start section above and get your secure authentication system running in minutes!
