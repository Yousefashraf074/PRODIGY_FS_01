# Testing Guide

## Manual API Testing

### Using cURL (PowerShell)

#### 1. Register User
```powershell
$registerData = @{
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $registerData
```

#### 2. Login User
```powershell
$loginData = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginData

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

#### 3. Get Current User
```powershell
$token = "your_jwt_token_here"

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

#### 4. Update Profile
```powershell
$token = "your_jwt_token_here"
$updateData = @{
    firstName = "Jonathan"
    lastName = "Smith"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/profile" `
  -Method PUT `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $token"
  } `
  -Body $updateData
```

#### 5. Get All Users (Admin)
```powershell
$adminToken = "admin_jwt_token_here"

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/users" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $adminToken"}
```

#### 6. Test Protected Route
```powershell
$token = "your_jwt_token_here"

Invoke-WebRequest -Uri "http://localhost:5000/api/protected/user-only" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

## Using Postman

### Setup
1. Open Postman
2. Create new Collection: "Auth System"
3. Add requests as below

### Request Examples

#### Register
- **Method**: POST
- **URL**: http://localhost:5000/api/auth/register
- **Body** (JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
- **Method**: POST
- **URL**: http://localhost:5000/api/auth/login
- **Body** (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Me (Protected)
- **Method**: GET
- **URL**: http://localhost:5000/api/auth/me
- **Headers**:
  - Key: Authorization
  - Value: Bearer {token}

#### Update Profile (Protected)
- **Method**: PUT
- **URL**: http://localhost:5000/api/auth/profile
- **Headers**:
  - Key: Authorization
  - Value: Bearer {token}
  - Key: Content-Type
  - Value: application/json
- **Body** (JSON):
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith"
}
```

## Frontend Testing

### 1. Test Registration
- Navigate to http://localhost:3000/register
- Fill in form with valid data
- Submit form
- Should redirect to dashboard

### 2. Test Login
- Navigate to http://localhost:3000/login
- Enter email and password
- Submit form
- Should redirect to dashboard

### 3. Test Protected Route
- Try to access http://localhost:3000/dashboard without login
- Should redirect to login page

### 4. Test Logout
- Click Logout button
- Should redirect to home page

### 5. Test Admin Functions
- Make sure user has admin role (manually in database or API)
- Dashboard should show "Manage Users" tab
- Should be able to view all users and delete them

## Database Testing

### Connect to MongoDB
```powershell
docker-compose exec mongo mongosh -u admin -p password123

# Inside mongosh:
use auth_db
db.users.find()
db.users.find({email: "john@example.com"})
```

### Manual User Creation
```powershell
docker-compose exec mongo mongosh -u admin -p password123

# Inside mongosh:
use auth_db
db.users.insertOne({
  firstName: "Test",
  lastName: "Admin",
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Error Scenarios to Test

### 1. Invalid Credentials
- Login with wrong password
- Should return: "Invalid credentials"

### 2. User Already Exists
- Register with existing email
- Should return: "User already exists with this email"

### 3. Password Mismatch
- Register with mismatched confirmPassword
- Should return: "Passwords do not match"

### 4. Missing Required Fields
- Register without email
- Should return validation error

### 5. Unauthorized Access
- Try to access protected route without token
- Should return: "Not authorized to access this route"

### 6. Invalid Token
- Use invalid/expired token
- Should return: "Not authorized to access this route"

### 7. Insufficient Permissions
- User tries to access admin route
- Should return: "User role 'user' is not authorized to access this route"

## Performance Testing

### Load Testing (using Apache Bench)
```powershell
# Install Apache Bench if not available
choco install apache-bench

# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:5000/api/auth/login
```

### Stress Testing
```powershell
# Create large number of users
for ($i=1; $i -le 100; $i++) {
  $data = @{
    firstName = "User"
    lastName = $i
    email = "user$i@example.com"
    password = "password123"
    confirmPassword = "password123"
  } | ConvertTo-Json
  
  Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $data
}
```

## Browser DevTools Testing

### 1. Network Tab
- Monitor all API requests
- Check response times
- Verify correct headers being sent

### 2. Application Tab
- Check localStorage for token
- Check cookies if applicable
- Verify data persistence

### 3. Console
- Look for any JavaScript errors
- Check API response errors
- Monitor authentication flow

## Automated Testing

### Jest Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Common Test Cases

| Scenario | Expected Result | Status |
|----------|-----------------|--------|
| Register valid user | User created, token returned | ✓ |
| Register duplicate email | Error message | ✓ |
| Login valid credentials | Token returned | ✓ |
| Login invalid credentials | Error message | ✓ |
| Access protected route with token | Data returned | ✓ |
| Access protected route without token | 401 Unauthorized | ✓ |
| Admin access admin route | Data returned | ✓ |
| User access admin route | 403 Forbidden | ✓ |
| Update own profile | Profile updated | ✓ |
| Delete user (admin) | User deleted | ✓ |

---

**Happy Testing!**
