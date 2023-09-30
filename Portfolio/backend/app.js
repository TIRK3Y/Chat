// backend/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Import route modules
const aboutRoute = require('./routes/about');
const graphicsRoute = require('./routes/graphics');
const projectsRoute = require('./routes/projects');
const musicRoute = require('./routes/music');
const videoRoute = require('./routes/video');

// Use the route modules
app.use('/api/about', aboutRoute);
app.use('/api/graphics', graphicsRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/music', musicRoute);
app.use('/api/video', videoRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
