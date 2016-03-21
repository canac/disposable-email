import express from 'express';
import mongoose from 'mongoose';
import shortid from 'shortid';
import * as authentication from './authentication.js';
import configuration from './configuration.js';
import models from './models.js';

// Connect to the database
mongoose.connect(`${configuration.mongodb.host}/${configuration.mongodb.db}`);

authentication.setup();

const { Email } = models;

const app = express();
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
