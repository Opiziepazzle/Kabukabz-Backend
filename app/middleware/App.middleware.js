const jwt = require('jsonwebtoken');
const userSchema = require("../models/user.model"); // Adjust the path according to your project structure


module.exports = (req, res, next) => {
    // Extract token from Authorization header or cookie
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
  
    if (!token) {
      return res.status(401).redirect('/login-register'); // Redirect to login if no token is found
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
  
      // Fetch the user from the database using the decoded userId
      userSchema.findById(decoded.userId)
        .then(user => {
          if (!user) {
            return res.status(401).redirect('/login-register');
          }
          req.user = user; // Attach the user object to the request
          next(); // Proceed to the next middleware or route handler
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server error', details: err.message });
        });
    } catch (error) {
      console.error(error);
      res.status(401).redirect('/login-register'); // Redirect to login if token verification fails
    }
  };



















// module.exports = (req, res, next) => {
//   // Extract token from Authorization header or cookie
//   const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : req.cookies.token;

//   if (!token) {
//     return res.status(401).redirect('/login-register'); // Redirect to login if no token is found
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_KEY);

//     // Fetch the user from the database using the decoded userId
//     userSchema.findById(decoded.userId)
//       .then(user => {
//         if (!user) {
//           return res.status(401).redirect('/login-register');
//         }
//         req.user = user; // Attach the user object to the request
//         next(); // Proceed to the next middleware or route handler
//       })
//       .catch(err => {
//         res.status(500).json({ error: 'Server error', details: err.message });
//       });
//   } catch (error) {
//     res.status(401).redirect('/login-register'); // Redirect to login if token verification fails
//   }
// };


