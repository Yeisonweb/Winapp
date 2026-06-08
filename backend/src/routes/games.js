const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const authMiddleware = require('../middleware/auth');

// Obtener todos los juegos
router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json({ success: true, games });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch games' });
  }
});

// Obtener detalles de un juego
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch game' });
  }
});

module.exports = router;
