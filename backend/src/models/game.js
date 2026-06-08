const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Game {
  static async create(name, description, minBet, maxBet) {
    const gameId = uuidv4();
    const result = await pool.query(
      'INSERT INTO games (id, name, description, min_bet, max_bet, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [gameId, name, description, minBet, maxBet]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(gameId) {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    return result.rows[0];
  }

  static async getGameRules(gameId) {
    const result = await pool.query('SELECT rules FROM games WHERE id = $1', [gameId]);
    return result.rows[0]?.rules;
  }
}

module.exports = Game;
