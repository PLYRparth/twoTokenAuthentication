# MERN Authentication Template

A production-quality MERN Stack Authentication application demonstrating industry best practices, featuring Access Tokens, Refresh Tokens, and Refresh Token Rotation.

## Project Overview

This project is a scalable, clean, and secure authentication template built on the MERN stack. It uses a modern Dark theme UI and enforces strict security measures, form validation, and responsive design.

## Features

- **JWT Authentication**: Two-token architecture (Access + Refresh tokens).
- **Refresh Token Rotation**: Enhanced security by rotating tokens on each refresh.
- **Axios Interceptor**: Automatically refreshes the token without interrupting the user experience.
- **Form Validation**: React Hook Form with Zod integration.
- **UI & UX**: Tailored Dark theme, Toast notifications, and loading indicators.
- **Security**: Password hashing (bcryptjs), HttpOnly cookies, Helmet, and rate-limiting.

## Architecture & Folder Structure

### Backend (Express)
\`\`\`
server/
├── config/       # Database and environment configurations
├── controllers/  # Business logic for routes
├── middleware/   # Auth, error handling, rate limiting
├── models/       # Mongoose schemas
├── routes/       # API endpoints
├── utils/        # Helpers (e.g., generateTokens)
├── app.js        # Express app configuration
└── server.js     # Server entry point
\`\`\`

### Frontend (Vite + React)
\`\`\`
client/
├── src/
│   ├── components/ # Reusable UI components
│   ├── context/    # React Context (AuthContext)
│   ├── hooks/      # Custom hooks
│   ├── pages/      # Route pages (Home, Login, Signup, Dashboard)
│   ├── services/   # Axios configuration & API interceptors
│   ├── utils/      # Client-side helpers
│   ├── constants/  # Constants (API URL)
│   ├── App.jsx     # Root component and Routing
│   └── main.jsx    # Entry point
\`\`\`

## Authentication Flow

1. **Signup**: User registers with Name, Email, and Password. Password is hashed, and a Refresh Token is generated and stored in an HttpOnly cookie and the database.
2. **Login**: User logs in. Server issues a short-lived Access Token (15 min) and a new Refresh Token (7 days) via HttpOnly cookie.
3. **Authorized Requests**: Access token is sent in the \`Authorization: Bearer <token>\` header for protected routes.
4. **Token Refresh**: If the Access token expires, the Axios interceptor catches the 401 response and automatically calls \`/api/auth/refresh\`. The server verifies the Refresh Token in the HttpOnly cookie, rotates it, and issues a new Access token.
5. **Logout**: Clears the HttpOnly cookie and invalidates the Refresh token in the database.

## API Endpoints

| Method | Endpoint             | Description                           | Protected |
|--------|----------------------|---------------------------------------|-----------|
| POST   | \`/api/auth/signup\` | Register a new user                   | No        |
| POST   | \`/api/auth/login\`  | Authenticate user                     | No        |
| POST   | \`/api/auth/refresh\`| Get a new Access Token                | No        |
| POST   | \`/api/auth/logout\` | Logout user                           | No        |
| GET    | \`/api/user/profile\`| Get user profile data                 | Yes       |

## Environment Variables

### Server (\`.env\`)
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
\`\`\`

### Client (\`.env\`)
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## Installation & Running Locally

1. **Clone & Install Dependencies**
   \`\`\`bash
   # Install server deps
   cd server
   npm install

   # Install client deps
   cd ../client
   npm install
   \`\`\`

2. **Run Application**
   - Backend: \`npm run dev\` (using nodemon)
   - Frontend: \`npm run dev\` (using Vite)

## Deployment

The application is designed to be easily deployable:
- **Frontend**: Deploy to Vercel by linking the repository. The build command is \`npm run build\` and the output directory is \`dist\`. Ensure environment variables are set in Vercel settings.
- **Backend**: Deploy to Railway or Render. Specify the \`PORT\` and ensure the MongoDB connection string (Atlas) is configured in the environment variables.

## Future Improvements

- Add password strength meter (UI) natively.
- Implement email verification and password resets.
- Add Role-Based Access Control (RBAC).
- Implement OAuth2 (Google/GitHub login).
