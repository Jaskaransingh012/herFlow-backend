const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log("aya");
  console.log(req.header('Authorization'));
  const result = req.header('Authorization')?.replace('Bearer ', '');
  const token = result.slice(1,-1);
  

  console.log(token); 
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;