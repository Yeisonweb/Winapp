const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Wallet = require('../models/wallet');
const Match = require('../models/match');
const Game = require('../models/game');

// Cola de espera para jugadores por apuesta
const waitingQueues = {}; // { 'gameId-betAmount': [userId] }

// Unirse a la cola de espera
router.post('/join-queue', authMiddleware, async (req, res) => {
  try {
    const { gameId, betAmount } = req.body;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    // Validar apuesta
    if (betAmount < game.min_bet || betAmount > game.max_bet) {
      return res.status(400).json({ success: false, message: 'Invalid bet amount' });
    }

    // Verificar saldo
    const wallet = await Wallet.findByUserId(req.user.id);
    if (wallet.balance < betAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const queueKey = `${gameId}-${betAmount}`;
    if (!waitingQueues[queueKey]) {
      waitingQueues[queueKey] = [];
    }

    // Verificar si el usuario ya está en la cola
    if (waitingQueues[queueKey].includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already in queue' });
    }

    waitingQueues[queueKey].push(req.user.id);

    // Si hay dos jugadores, crear partida
    if (waitingQueues[queueKey].length >= 2) {
      const player1Id = waitingQueues[queueKey].shift();
      const player2Id = waitingQueues[queueKey].shift();
      const potAmount = betAmount * 2;

      const match = await Match.create(gameId, player1Id, player2Id, betAmount, potAmount);

      // Deducir apuestas de las billeteras
      await Wallet.withdraw(player1Id, betAmount, 'bet', 0);
      await Wallet.withdraw(player2Id, betAmount, 'bet', 0);

      return res.json({
        success: true,
        message: 'Match found!',
        matchId: match.id,
        opponent: player2Id,
        potAmount
      });
    }

    res.json({
      success: true,
      message: 'Added to queue',
      queuePosition: waitingQueues[queueKey].indexOf(req.user.id) + 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to join queue' });
  }
});

// Salir de la cola
router.post('/leave-queue', authMiddleware, (req, res) => {
  try {
    const { gameId, betAmount } = req.body;
    const queueKey = `${gameId}-${betAmount}`;

    if (waitingQueues[queueKey]) {
      waitingQueues[queueKey] = waitingQueues[queueKey].filter(id => id !== req.user.id);
    }

    res.json({ success: true, message: 'Left queue' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to leave queue' });
  }
});

module.exports = router;
