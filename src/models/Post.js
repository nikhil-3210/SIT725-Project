const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Only donors can create posts
  },
  title: {
    type: String,
    required: [true, 'Please enter the title of the post'],
  },
  description: {
    type: String,
    required: [true, 'Please enter the description'],
  },
  quantity: {
    type: String,
    required: [true, 'Please enter the quantity'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);