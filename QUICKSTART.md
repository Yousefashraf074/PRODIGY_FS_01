# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Navigate to Project
```powershell
cd PRODIGY_FS_01
```

### Step 2: Start Docker Services
```powershell
docker-compose up --build
```

Wait for all services to start:
- ✅ MongoDB (port 27017)
- ✅ Backend (port 5000)
- ✅ Frontend (port 3000)

### Step 3: Access the Application

#### Frontend (User Interface)
Open browser and go to: **http://localhost:3000**

#### Backend API
Test API: **http://localhost:5000/api/health**

### Step 4: Create Your First Account

1. Click "Sign Up" on home page
2. Fill in details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Register"
4. You'll be logged in automatically!

### Step 5: Explore Features

- **View Profile**: See your user information and role
- **Logout**: Click logout button in top right

---

## 📂 Project Structure

```
PRODIGY_FS_01/
├── backend/           # Node.js/Express API
├── frontend/          # React application
├── docker-compose.yml # Docker configuration
├── README.md          # Full documentation
├── API_REFERENCE.md   # API endpoints guide
├── TESTING.md         # Testing guide
└── DEPLOYMENT.md      # Deployment guide
```

---

## 🔑 Key Features

✅ **Secure Login & Registration**
- Bcrypt password hashing
- Input validation
- Email verification ready

✅ **JWT Authentication**
- Stateless token-based auth
- Auto-logout on expiry
- Secure headers

✅ **Role-Based Access Control**
- User roles: user, moderator, admin
- Protected routes by role
- Admin user management

✅ **Docker Containerized**
- MongoDB database
- Node.js backend
- React frontend
- All in one command

---

## 🧪 Test It Out

### Via Web Interface

1. **Register**: http://localhost:3000/register
2. **Login**: http://localhost:3000/login
3. **Dashboard**: http://localhost:3000/dashboard (auto after login)

### Via API (PowerShell)

**Register:**
```powershell
$data = @{
    firstName = "Jane"
    lastName = "Smith"
    email = "jane@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $data
```

**Login:**
```powershell
$creds = @{
    email = "jane@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $creds

Write-Host ($response.Content | ConvertFrom-Json).token
```

---

## 🛑 Stop & Clean Up

### Stop Services
```powershell
docker-compose down
```

### Remove All Data (including database)
```powershell
docker-compose down -v
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

---

## ⚙️ Configuration

### Environment Variables

**Backend** - `backend/.env`
```
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongo:27017/auth_db?authSource=admin
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend** - `frontend/.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔒 Security Features

- **Password Hashing**: Bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Middleware-based protection
- **Role-Based Access**: Fine-grained permissions
- **Input Validation**: Server-side validation
- **CORS**: Configured cross-origin requests
- **Error Handling**: Secure error messages

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Full system documentation |
| [API_REFERENCE.md](API_REFERENCE.md) | Complete API endpoints |
| [TESTING.md](TESTING.md) | Testing guide & examples |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [DOCKER_SETUP.md](DOCKER_SETUP.md) | Docker setup details |

---

## ❓ Troubleshooting

### Port Already in Use
```powershell
# Check what's using port 5000/3000
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process
taskkill /PID process_id /F

# Or change ports in docker-compose.yml
```

### MongoDB Connection Error
```powershell
# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Frontend Not Loading
```powershell
# Check frontend logs
docker-compose logs frontend

# Verify backend is running
curl http://localhost:5000/api/health
```

### Clear Everything & Start Fresh
```powershell
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

## 🎯 Next Steps

1. **Explore the Code**: Check backend and frontend source
2. **Test the APIs**: Use provided API examples
3. **Read Documentation**: See API_REFERENCE.md for details
4. **Customize**: Modify for your needs
5. **Deploy**: See DEPLOYMENT.md for production setup

---

## 📞 Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](DEPLOYMENT.md#troubleshooting-production-issues)
2. Review [API_REFERENCE.md](API_REFERENCE.md)
3. Check Docker logs: `docker-compose logs -f`

---

**Happy Coding! 🎉**

Your secure authentication system is ready to use!
