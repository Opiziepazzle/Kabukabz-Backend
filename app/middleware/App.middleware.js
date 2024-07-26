const jwt = require('jsonwebtoken');
const userSchema = require("../models/user.model"); 


  
  
  module.exports = (req, res, next) => {
      const token = req.cookies.token || req.headers['authorization'];
  
      if (!token) {
          return res.status(401).json({ message: 'Auth failed: No token provided' });
      }
  
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
          if (err) {
              return res.status(401).json({ message: 'Auth failed: Invalid token' });
          }
  
          userSchema.findById(decoded.userId)
              .exec()
              .then(user => {
                  if (!user) {
                      return res.status(401).json({ message: 'Auth failed: User not found' });
                  }
                  req.user = user; // Attach user information to the request object
                  next();
              })
              .catch(err => {
                  res.status(500).json({ error: 'Server error', details: err.message });
              });
      });
  };
  
  
  











