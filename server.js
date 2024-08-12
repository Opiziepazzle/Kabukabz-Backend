const express = require('express')
const app = express()
const PORT = process.env.PORT || 1911
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const checkAuth = require('./app/middleware/App.middleware')
const bodyParser  = require('body-parser')
const userRoutes = require('./app/routes/App.routes')
const userInfoRoutes = require('./app/routes/UserInfo.routes')
const verifyRoutes = require('./app/routes/Auth.routes')
const googleRoutes = require('./app/routes/GoogleAuth.routes')
const locationsRoutes = require('./app/routes/Location.routes')
const passport = require('passport');
const ErrorHandler = require('./app/middleware/ErrorHandler.middleware');
const session = require('express-session');

 require('./app/database/Mongo.database')
 require('dotenv').config();


//making upload folder publicly available and then passing the middleware
app.use('/uploads', express.static('uploads') )

 // Passport configuration
require('./app/config/passport'); //(passport);
 
 app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());








//Configure Handlebars to Allow Prototype Property Access
 app.use(express.json())
const { engine } = require("express-handlebars");
app.engine("hbs", engine({ extname: ".hbs", defaultLayout: "main",
   
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }

}));

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
 
 app.use(bodyParser.urlencoded({extended: false}))
 app.use(bodyParser.json());
app.use(cookieParser());



 //Routes which should handle request
app.use('/user', userRoutes)
app.use('/user', verifyRoutes)
app.use('/user', userInfoRoutes)
app.use('/auth', googleRoutes)
app.use('/locations', locationsRoutes);




 //Handling CORS Error
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization "
    );
    if ( req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({});
    }
    next();
  })




  //Error Handling 
  ErrorHandler(app)

  
  
  
  
  app.listen(PORT, () => {
      console.log(`Server started running on port ${PORT}`);
    });