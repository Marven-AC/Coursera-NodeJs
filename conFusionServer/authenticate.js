// store authentification strategies
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

// User.authenticate() from passport local mongoose
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());