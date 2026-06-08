const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// Obtener perfil del usuario
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Actualizar perfil
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, paypalEmail, bankAccount } = req.body;
    const user = await User.updateProfile(req.user.id, username, paypalEmail, bankAccount);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;
