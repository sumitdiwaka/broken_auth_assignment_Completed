const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const requestLogger = require("./middleware/logger");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Session storage (in-memory)
const loginSessions = {};
const otpStore = {};

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser()); // Added cookie-parser middleware to read cookies

app.get("/", (req, res) => {
  res.json({
    challenge: "Complete the Authentication Flow",
    instruction: "Complete the authentication flow and obtain a valid access token.",
  });
});

// Task 1: Fix Login
app.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const loginSessionId = Math.random().toString(36).substring(7);
    const otp = Math.floor(100000 + Math.random() * 900000);

    loginSessions[loginSessionId] = {
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 1000,
    };

    otpStore[loginSessionId] = otp;

    // LOG THE OTP so you can see it in the terminal
    console.log(`[OTP] Session ${loginSessionId} generated: ${otp}`);

    return res.status(200).json({
      message: "OTP sent",
      loginSessionId,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Login failed" });
  }
});

// Task 2: Fix OTP Verification
app.post("/auth/verify-otp", (req, res) => {
  try {
    const { loginSessionId, otp } = req.body;
    const session = loginSessions[loginSessionId];

    if (!session || Date.now() > session.expiresAt) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    if (parseInt(otp) !== otpStore[loginSessionId]) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Set the cookie
    res.cookie("session_token", loginSessionId, {
      httpOnly: true,
      secure: false, 
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    delete otpStore[loginSessionId];
    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "OTP verification failed" });
  }
});

// Task 3: Fix Token Generation
app.post("/auth/token", (req, res) => {
  try {
    
    const sessionToken = req.cookies.session_token;

    if (!sessionToken || !loginSessions[sessionToken]) {
      return res.status(401).json({ error: "Unauthorized - valid session cookie required" });
    }

    const session = loginSessions[sessionToken];
    const secret = process.env.JWT_SECRET || "default-secret-key";

    const accessToken = jwt.sign(
      { email: session.email }, 
      secret,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ access_token: accessToken });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Token generation failed" });
  }
});

// Task 4: Protected route
app.get("/protected", authMiddleware, (req, res) => {
  return res.json({
    message: "Access granted",
    user: req.user,
    success_flag: `FLAG-${Buffer.from(req.user.email + "_COMPLETED_ASSIGNMENT").toString('base64')}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});