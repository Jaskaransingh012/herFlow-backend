const validateRequest = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    next();
  };
  
  module.exports = validateRequest;