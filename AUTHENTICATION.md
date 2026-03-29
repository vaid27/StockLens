# StockLens Authentication System - Documentation

## Overview

This document explains the complete Authentication & User Management system implemented in StockLens.

## Features Implemented

### 1. **User Registration & Login**
- ✅ Secure user registration with password validation
- ✅ Email verification ready (extensible)
- ✅ Password strength requirements (8+ chars, uppercase, digits)
- ✅ Login with email and password
- ✅ JWT-based authentication

### 2. **Security Features**
- ✅ Password hashing with bcrypt
- ✅ JWT access tokens (1 hour expiration)
- ✅ Refresh tokens (30 days expiration)
- ✅ Automatic token refresh mechanism
- ✅ Session tracking for security audits

### 3. **User Profile Management**
- ✅ Update first/last name
- ✅ Bio/profile description
- ✅ Avatar URL storage
- ✅ Theme preference (dark/light)
- ✅ Notification settings

### 4. **Account Security**
- ✅ Change password functionality
- ✅ Soft delete account option
- ✅ Session management
- ✅ IP address & User-Agent tracking

## Project Structure

### Backend Files

```
backend/
├── models.py              # Database models (User, Watchlist, Portfolio, etc.)
├── auth.py                # Authentication routes (register, login, etc.)
├── server.py              # Main Flask app with JWT setup
└── requirements.txt       # Updated with new dependencies
```

### Frontend Files

```
src/
├── pages/
│   ├── Login.js           # Login page
│   ├── Register.js        # Registration page
│   └── Settings.js        # Updated with profile management
├── context/
│   └── AuthContext.js     # Auth state management via Context API
├── components/
│   └── ProtectedRoute.js  # Protected & Public route wrappers
├── services/
│   └── api.js             # Axios interceptors for JWT
└── App.js                 # Updated with auth routes
```

## Database Models

### User Model
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `first_name`, `last_name` - Profile info
- `bio` - User bio
- `avatar_url` - Profile picture
- `theme` - UI theme preference
- `notifications_enabled` - Global notification toggle
- `email_alerts` - Email alerts toggle
- `is_active` - Account status
- `email_verified` - Email verification status
- `created_at`, `updated_at`, `last_login` - Timestamps

### Related Models
- `Watchlist` - User's stock watchlist
- `PortfolioHolding` - Portfolio positions
- `PriceAlert` - User-created price alerts
- `UserSession` - Session tracking for security

## API Endpoints

### Authentication Routes (`/api/auth/`)

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "message": "Registration successful",
  "user": { ... },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "username": "johndoe123",
  "email": "john@example.com",
  ...
}
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <refresh_token>

Response: 200 OK
{
  "access_token": "eyJhbGc..."
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "bio": "Investor and trader",
  "theme": "dark"
}

Response: 200 OK
{
  "message": "Profile updated",
  "user": { ... }
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "OldPass123",
  "new_password": "NewPass456"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Logout successful"
}
```

## Frontend Implementation

### Auth Context (AuthContext.js)

Provides authentication state to the entire app:

```typescript
const { 
  user,                    // Current logged-in user object
  isAuthenticated,         // Boolean for auth state
  loading,                 // Loading state
  login,                   // Async login function
  register,                // Async register function
  logout,                  // Async logout function
  refreshToken,            // Token refresh
  updateProfile,           // Update user profile
  changePassword           // Change password
} = useAuth();
```

### Protected Routes (ProtectedRoute.js)

Two route types:
- `ProtectedRoute` - Only authenticated users
- `PublicRoute` - Only unauthenticated users (redirects to home if logged in)

Usage:
```jsx
<Route path="/portfolio" element={
  <ProtectedRoute>
    <Layout><Portfolio /></Layout>
  </ProtectedRoute>
} />
```

### API Interceptors (api.js)

Automatically:
- Adds JWT token to all requests
- Refreshes tokens when expired
- Redirects to login on 401 errors

## Setup Instructions

### Backend Setup

1. **Install new dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `JWT_SECRET_KEY` with a secure key
   - Keep `DATABASE_URL` as SQLite for development

3. **Initialize database:**
   ```bash
   python
   >>> from server import app, db
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

4. **Start backend:**
   ```bash
   python server.py
   ```

### Frontend Setup

1. **Update package.json:**
   Already included in dependencies

2. **Start frontend:**
   ```bash
   npm install  # if needed
   npm start
   ```

## Usage Flow

1. **User visits app** → `/login` (public route)
2. **User registers/logs in** → Tokens saved to localStorage
3. **AuthProvider initializes** → Checks for existing tokens
4. **User accesses protected routes** → ProtectedRoute checks auth status
5. **API calls** → Interceptor adds JWT token
6. **Token expires** → Interceptor auto-refreshes
7. **Refresh token expires** → Redirect to login

## Security Best Practices

### Implemented ✅
- Password hashing with bcrypt
- HTTPS ready (configure in production)
- Token expiration (1 hour access, 30 days refresh)
- Session tracking
- Soft delete for user data retention

### Before Production Deployment

1. **Change JWT_SECRET_KEY** to a strong random string
2. **Enable HTTPS/SSL** - Configure Flask with proper SSL
3. **Use PostgreSQL** instead of SQLite
4. **Add Rate Limiting** - Prevent brute force attacks
5. **Enable CSRF Protection** - Add CSRF tokens
6. **Email Verification** - Send verification emails on signup
7. **Password Reset** - Add forgot password functionality
8. **2FA** - Implement Two-Factor Authentication
9. **CORS Configuration** - Restrict to your domain only
10. **Environment Variables** - Never commit .env file

## Extension Points

The system is designed to be easily extended:

### Add Email Verification
```python
# In auth.py - add email sending after registration
send_verification_email(user.email, verify_token)
```

### Add Password Reset
```python
@auth_bp.route('/password-reset', methods=['POST'])
def request_password_reset():
    # Send reset email with token
```

### Add Google/GitHub Login
```python
# Use Flask-OAuth for social login integration
```

### Add 2FA
```python
# Use pyotp library for TOTP tokens
```

## Troubleshooting

### "Token expired" error
- Automatic refresh happens in the interceptor
- Check that refresh token is stored in localStorage
- Clear localStorage and login again if persistent

### Database not created
- Manually run: `python -c "from server import app, db; app.app_context().push(); db.create_all()"`
- Check DATABASE_URL environment variable

### CORS errors
- Ensure backend is running on port 5000
- Check CORS_ORIGINS matches your frontend URL

### Password validation fails
- Password must be:
  - At least 8 characters
  - Contains uppercase letter
  - Contains at least one digit

## Next Steps

### Recommended Implementations

1. **Email Verification** - Verify email with OTP
2. **Password Reset Flow** - Implement forgot password
3. **OAuth Integration** - Google, GitHub login
4. **Two-Factor Authentication** - TOTP or SMS based
5. **Email Notifications** - Send alerts via email
6. **User Roles & Permissions** - Admin, Premium, Free tiers
7. **Audit Logging** - Track user actions
8. **API Key Management** - For programmatic access

## Files Modified/Created

### Created
- `backend/models.py` - Database models
- `backend/auth.py` - Authentication routes
- `src/pages/Login.js` - Login page
- `src/pages/Register.js` - Registration page
- `src/context/AuthContext.js` - Auth state
- `src/components/ProtectedRoute.js` - Route protection
- `src/services/api.js` - API interceptors

### Modified
- `backend/server.py` - Added Flask-JWT, database setup
- `backend/requirements.txt` - Added auth dependencies
- `src/App.js` - Added auth routes and providers
- `src/Layout.js` - Added user profile menu
- `src/pages/Settings.js` - Added profile management

## Support & Resources

- Flask-JWT-Extended: https://flask-jwt-extended.readthedocs.io/
- SQLAlchemy: https://docs.sqlalchemy.org/
- React Context API: https://react.dev/reference/react/useContext
- JWT Tokens: https://jwt.io/

---

**Authentication System Version: 1.0**
**Last Updated**: March 2026
