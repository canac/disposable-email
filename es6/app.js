import express from 'express';
import mongoose from 'mongoose';
import configuration from './configuration.js';

// Connect to the database
mongoose.connect(`${configuration.mongodb.host}/${configuration.mongodb.db}`);

const app = express();

// Start the express server
app.listen(process.env.PORT || 8000);
