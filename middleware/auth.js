const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  
  const authHeader = req.headers.authorization; // Renamed for clarity

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const secret = process.env.JWT_SECRET || "default-secret-key";
    
    //  Extract token and verify
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    
    //  Attach user to request object
    req.user = decoded;

    //  MUST call next() to move to the next function/route
    next(); 
    
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};