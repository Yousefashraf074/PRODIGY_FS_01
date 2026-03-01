# API Reference Guide

## Base URL
```
Development: http://localhost:5000/api
Production: https://yourdomain.com/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "confirmPassword": "string (required)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- 400: User already exists
- 400: Passwords don't match
- 400: Invalid email format
- 400: Missing required fields

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- 400: Missing email or password
- 401: Invalid credentials

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### GET /auth/me
Get current authenticated user.

**Required Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- 401: No token provided
- 401: Invalid token

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

---

### PUT /auth/profile
Update current user's profile.

**Required Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "firstName": "Jonathan",
    "lastName": "Smith",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- 401: Not authenticated
- 400: Validation errors

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "lastName": "Smith"
  }'
```

---

## Admin Endpoints

### GET /auth/users
Get all users (Admin only).

**Required Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Cases:**
- 401: Not authenticated
- 403: User doesn't have admin role
- 500: Server error

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer {admin_token}"
```

---

### DELETE /auth/users/{userId}
Delete a user (Admin only).

**Parameters:**
- userId (path): The ID of the user to delete

**Required Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Cases:**
- 401: Not authenticated
- 403: Insufficient permissions
- 404: User not found
- 500: Server error

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/auth/users/60d5ec49c1234567890abcde \
  -H "Authorization: Bearer {admin_token}"
```

---

### PUT /auth/users/{userId}/role
Update user role (Admin only).

**Parameters:**
- userId (path): The ID of the user

**Required Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "user|admin|moderator"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Valid Roles:**
- user
- admin
- moderator

**Error Cases:**
- 400: Invalid role
- 401: Not authenticated
- 403: Insufficient permissions
- 404: User not found

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/users/60d5ec49c1234567890abcde/role \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

---

## Protected Routes

### GET /protected/user-only
User-only protected route.

**Required Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "This is a protected user route",
  "userId": "user_id"
}
```

**Error Cases:**
- 401: No token or invalid token

---

### GET /protected/admin-only
Admin-only protected route.

**Required Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "This is an admin-only route",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error Cases:**
- 401: No token or invalid token
- 403: User is not admin

---

### GET /protected/moderator-only
Moderator/Admin protected route.

**Required Headers:**
```
Authorization: Bearer {moderator_or_admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "This route is accessible to admin and moderators",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "moderator"
  }
}
```

**Error Cases:**
- 401: No token or invalid token
- 403: User doesn't have required role

---

## Health Check

### GET /api/health
Check if server is running.

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Handling

### Common Error Responses

**Missing Required Field:**
```json
{
  "success": false,
  "errors": [
    {
      "value": "",
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Invalid Email Format:**
```json
{
  "success": false,
  "errors": [
    {
      "value": "invalid-email",
      "msg": "Please provide valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**Forbidden:**
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

**Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently, rate limiting is not enabled but can be added:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Pagination

Pagination endpoints (to be implemented):

**Request:**
```
GET /auth/users?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "totalCount": 50,
  "totalPages": 5,
  "currentPage": 1,
  "users": []
}
```

---

## Sorting & Filtering

Filtering endpoints (to be implemented):

**Request:**
```
GET /auth/users?role=admin&sort=-createdAt
```

---

## Token Details

### JWT Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Token Expiry
Default: 7 days (configurable via JWT_EXPIRE)

### Token Refresh
Currently, tokens don't auto-refresh. Implement refresh token endpoint for enhanced security:

```javascript
POST /auth/refresh-token
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Never expose tokens** in logs or URLs
3. **Store tokens securely** (httpOnly cookies preferred)
4. **Implement CORS** properly
5. **Validate all inputs** server-side
6. **Use strong passwords** (minimum 8 characters recommended)
7. **Rotate secrets regularly**
8. **Monitor API usage**
9. **Implement rate limiting**
10. **Keep dependencies updated**

---

## SDK/Library Support

### JavaScript/Node.js
```javascript
import apiClient from './services/api';

// Register
const registerResponse = await apiClient.post('/auth/register', userData);

// Login
const loginResponse = await apiClient.post('/auth/login', credentials);

// Get token
const token = localStorage.getItem('token');
```

### Python
```python
import requests

response = requests.post(
  'http://localhost:5000/api/auth/login',
  json={'email': 'user@example.com', 'password': 'password123'}
)
token = response.json()['token']
```

### cURL
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

---

## Versioning

Current API Version: **1.0.0**

Future versions will use URL versioning:
```
/api/v1/auth/login
/api/v2/auth/login
```

---

**Last Updated:** February 2024
**API Version:** 1.0.0
