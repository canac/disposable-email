import express from 'express';
import mongoose from 'mongoose';
import shortid from 'shortid';
import configuration from './configuration.js';
import models from './models.js';

// Connect to the database
mongoose.connect(`${configuration.mongodb.host}/${configuration.mongodb.db}`);

const { Email } = models;

const app = express();

// Generate a new random email address
app.get('/generate', (req, res, next) => {
  const newEmail = new Email({ address: `${shortid.generate()}@${configuration.domain}` });
  newEmail.save().then(() => {
    res.send(newEmail.address);
  }).catch(err => next(err));
});

// Start the express server
app.listen(process.env.PORT || 8000);
