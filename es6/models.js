import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create the Mongoose models
const Email = mongoose.model('email', new Schema({
  userId: { type: String, required: true },
  address: { type: String, required: true },
  domain: { type: String, required: true },
}));

export {
  Email,
};
