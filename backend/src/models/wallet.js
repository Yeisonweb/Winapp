const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Wallet {
  static async create(userId) {
    const walletId = uuidv4();
    const result = await pool.query(
      'INSERT INTO wallets (id, user_id, balance, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [walletId, userId, 0]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  static async deposit(userId, amount, method, transactionId) {
    const txId = uuidv4();
    await pool.query(
      'INSERT INTO transactions (id, user_id, type, amount, method, transaction_id, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
      [txId, userId, 'deposit', amount, method, transactionId, 'completed']
    );

    const result = await pool.query(
      'UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [amount, userId]
    );
    return result.rows[0];
  }

  static async withdraw(userId, amount, method, fee) {
    const txId = uuidv4();
    const netAmount = amount - fee;

    await pool.query(
      'INSERT INTO transactions (id, user_id, type, amount, fee, method, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
      [txId, userId, 'withdrawal', amount, fee, method, 'pending']
    );

    const result = await pool.query(
      'UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [amount, userId]
    );
    return result.rows[0];
  }

  static async getTransactionHistory(userId, limit = 50) {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  }
}

module.exports = Wallet;
