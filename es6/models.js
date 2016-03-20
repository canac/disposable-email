import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create the Mongoose models
const Email = mongoose.model('email', new Schema({
  address: { type: String, required: true },
}));

export default {
  Email,
};
