const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (update the MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/testdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Models
const User = require('./models/User');
const Message = require('./models/Message');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Secret key for JWT
const secretKey = 'e5d36109087c7064';

// Set up Socket.io
const onlineUsers = new Set(); // Store online users

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit updated online users to the connecting client
  socket.emit('updateUsers', Array.from(onlineUsers));

  // Handle incoming messages
  socket.on('chat message', async (data) => {
    try {
      const { roomId, message, token } = data;

      // Verify and decode JWT token
      const decoded = jwt.verify(token, secretKey);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Save the message to the database
      const newMessage = new Message({ text: message, user: decoded.username, roomId });
      await newMessage.save();

      // Broadcast the message to all connected clients in the room
      io.to(roomId).emit('chat message', { message, username: decoded.username });
    } catch (error) {
      console.error('Error sending message:', error.message);
      socket.emit('chat message', { message: 'Error: Unable to send message', username: 'System' });
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    onlineUsers.delete(socket.id);
    io.emit('updateUsers', Array.from(onlineUsers)); // Update online users after disconnection
  });
});

// Handle signup
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred during registration' });
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey);

    res.json({ success: true, token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
