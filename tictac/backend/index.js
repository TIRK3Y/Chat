const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Require http module
const socketIo = require('socket.io'); // Require socket.io module
const gameRoutes = require('./routes/game');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tictac', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to database');
});

// Create HTTP server and integrate with Express
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io

// Socket.io logic for live collaboration
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room (here, we can consider each game as a room)
  socket.on('join', (roomId) => {
    socket.join(roomId);
  });

  // Broadcast game state updates to all users in the room
  socket.on('gameStateUpdate', ({ roomId, gameState }) => {
    io.to(roomId).emit('gameStateUpdate', gameState);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Integrate game routes
app.use('/api/game', (req, res, next) => {
  req.io = io; // Pass socket.io instance to routes
  next();
}, gameRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
