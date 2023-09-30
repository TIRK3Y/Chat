const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Define your projects route(s)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
