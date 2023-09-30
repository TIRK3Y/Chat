const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  },
  { timestamps: true } // Added timestamps for createdAt and updatedAt
);

module.exports = mongoose.model('Message', messageSchema);
