const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route for Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route for Google callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo ||'/my-account');
  }
);



// Home route
// router.get('/', (req, res) => {
//   res.render('index', { user: req.user });
// });

// My Account route
// router.get('/my-account', (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect('/login');
//   }
//   res.render('my-account', { user: req.user });
// });

// Login route
// router.get('/login', (req, res) => {
//   res.render('login');
// });

module.exports = router;
