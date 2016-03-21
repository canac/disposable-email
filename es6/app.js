import mongodbSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import shortid from 'shortid';
import * as authentication from './authentication.js';
import configuration from './configuration.js';
import models from './models.js';

// Connect to the database
const mongodbUri = `${configuration.mongodb.host}/${configuration.mongodb.db}`;
mongoose.connect(mongodbUri);
const MongoDBStore = mongodbSession(session);
const sessionStore = new MongoDBStore({ uri: mongodbUri, collection: 'sessions' });

authentication.setup();

const { Email } = models;

const app = express();
app.use(cookieParser());
app.use(session({
  secret: configuration.session.secret,
  cookie: { maxAge: configuration.session.maxAge },
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));
app.use(authentication.middleware());

// Generate a new random email address
app.get('/generate', (req, res, next) => {
  const { domain } = req.query;
  if (!domain) {
    next(new Error('No domain provided'));
  }

  // Try to find an existing email address associated with this domain
  Email.find({ domain }).then(emails => {
    if (emails.length > 0) {
      // Use the found email address
      return emails[0];
    }

    // Generate a new email address
    const newEmail = new Email({
      address: `${shortid.generate()}@${configuration.domain}`,
      domain,
    });
    return newEmail.save();
  }).then(email => {
    res.send(email.address);
  }).catch(err => next(err));
});

// Start the express server
app.listen(process.env.PORT || 8000);
