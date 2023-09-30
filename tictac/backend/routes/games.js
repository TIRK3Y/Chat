const express = require('express');
const router = express.Router();
const GameState = require('../models/gameState');

router.post('/', async (req, res) => {
  try {
    const gameState = req.body;
    const newGameState = new GameState(gameState);
    await newGameState.save();
    res.status(201).json(newGameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const gameState = await GameState.findById(req.params.id);
    if (gameState == null) {
      return res.status(404).json({ message: 'Game state not found' });
    }
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
