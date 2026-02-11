# The Silent Server - Auth Debugging Assignment

This repository contains my submission for the Backend Debugging Assignment. The goal was to fix a "broken" Node.js authentication API and successfully complete a multi-step login and verification flow.

## 🛠️ Bugs Fixed

- **Middleware Hangs**: Added missing `next()` calls in `logger.js` and `auth.js` that were causing the server to hang indefinitely.
- **Cookie Parsing**: Initialized `cookie-parser` in `server.js` to allow the server to read the session cookie.
- **Token Exchange Logic**: Fixed the `/auth/token` endpoint to correctly retrieve the session ID from cookies rather than the Authorization header.
- **Type Safety**: Ensured OTP comparison used consistent data types (Integer vs String).
- **Security**: Implemented proper JWT signing using environment-based secrets.

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   npm install

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   Server runs at: `http://localhost:3000`
   
📋 Results
The full authentication flow was successfully verified:

[x] Login & OTP Generation

[x] OTP Verification & Session Cookie

[x] JWT Token Exchange

[x] Protected Route Access (Success Flag obtained)

Success Flag: FLAG-c3VtaXRkaXdha2FyNDc2QGdtYWlsLmNvbV9DT01QTEVURURfQVNTSUdOTUVOVA==
