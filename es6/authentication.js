import express from 'express';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import configuration from './configuration.js';

// Setup authentication
export function setup() {
  // Configure the Auth0 Passport strategy
  passport.use(new Auth0Strategy(
    Object.assign({ callbackURL: '/callback' }, configuration.auth0),
    (accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
  ));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

// Return authentication middleware suitable for use in an express app
export function middleware() {
  const router = new express.Router();
  router.use(passport.initialize());
  router.use(passport.session());

  // Setup Passport-related routes
  router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/login', successRedirect: '/' }),
    (req, res, next) => {
      if (!req.user) {
        next(new Error('No user'));
      }
    }
  );
  router.get('/login', passport.authenticate('auth0'));

  return router;
}

// Return authentication express middleware that will ensure that the user is logged in
export function authenticated() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  };
}
