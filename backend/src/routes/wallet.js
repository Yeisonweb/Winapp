const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Obtener saldo de cartera
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findByUserId(req.user.id);
    res.json({ success: true, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch balance' });
  }
});

// Depósito con PayPal
router.post('/deposit/paypal', authMiddleware, [
  body('amount').isFloat({ min: 0.01 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { amount } = req.body;
    const payment = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      transactions: [{
        amount: {
          total: amount.toString(),
          currency: 'USD',
          details: { subtotal: amount.toString() }
        },
        description: `WinApp Deposit - $${amount}`
      }],
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/deposit/success`,
        cancel_url: `${process.env.FRONTEND_URL}/deposit/cancel`
      }
    };

    paypal.payment.create(payment, async (error, payment) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.json({ success: true, redirectUrl: payment.links[1].href });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deposit failed' });
  }
});

// Ejecutar depósito PayPal
router.post('/deposit/paypal/execute', authMiddleware, async (req, res) => {
  try {
    const { paymentId, payerId, amount } = req.body;

    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, payment) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      const wallet = await Wallet.deposit(req.user.id, amount, 'paypal', paymentId);
      res.json({ success: true, wallet });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deposit execution failed' });
  }
});

// Retiro
router.post('/withdraw', authMiddleware, [
  body('amount').isFloat({ min: 5 }),
  body('method').isIn(['paypal', 'bank']),
  body('accountEmail').optional().isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { amount, method } = req.body;
    const wallet = await Wallet.findByUserId(req.user.id);

    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    let fee = 0;
    if (amount === 5) fee = 2;
    else if (amount === 20) fee = 5;
    else if (amount > 20) fee = amount * 0.1;

    const updatedWallet = await Wallet.withdraw(req.user.id, amount, method, fee);
    res.json({
      success: true,
      message: 'Withdrawal request submitted',
      amount,
      fee,
      netAmount: amount - fee,
      wallet: updatedWallet
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Withdrawal failed' });
  }
});

// Historial de transacciones
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await Wallet.getTransactionHistory(req.user.id);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
});

module.exports = router;
