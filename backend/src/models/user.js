const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(email, password, username) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const result = await pool.query(
      'INSERT INTO users (id, email, username, password, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, username',
      [userId, email, username, hashedPassword]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, email, username, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async updateProfile(id, username, paypalEmail = null, bankAccount = null) {
    const result = await pool.query(
      'UPDATE users SET username = $1, paypal_email = $2, bank_account = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, username, paypal_email, bank_account',
      [username, paypalEmail, bankAccount, id]
    );
    return result.rows[0];
  }
}

module.exports = User;
