const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} =  require("../utils/middlewares.js");
const userController = require('../controllers/user.js');


router
.route('/signup')
// rendering Sign Up page
.get(userController.renderSignupForm)
// storing new user data
.post(saveRedirectUrl,wrapAsync(userController.signup));

router
.route('/login')
// rendering login page
.get(userController.renderLoginForm)
// uthenicating user using login details
.post(saveRedirectUrl
        ,passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true})
        ,userController.login);

// logout user
router.get("/logout",userController.logout)
module.exports = router;