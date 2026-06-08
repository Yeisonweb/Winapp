const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Match {
  static async create(gameId, player1Id, player2Id, betAmount, potAmount) {
    const matchId = uuidv4();
    const result = await pool.query(
      'INSERT INTO matches (id, game_id, player1_id, player2_id, bet_amount, pot_amount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [matchId, gameId, player1Id, player2Id, betAmount, potAmount, 'active']
    );
    return result.rows[0];
  }

  static async findById(matchId) {
    const result = await pool.query('SELECT * FROM matches WHERE id = $1', [matchId]);
    return result.rows[0];
  }

  static async endMatch(matchId, winnerId) {
    const result = await pool.query(
      'UPDATE matches SET status = $1, winner_id = $2, ended_at = NOW() WHERE id = $3 RETURNING *',
      ['completed', winnerId, matchId]
    );
    return result.rows[0];
  }

  static async getPlayerMatches(playerId, limit = 20) {
    const result = await pool.query(
      'SELECT * FROM matches WHERE player1_id = $1 OR player2_id = $1 ORDER BY created_at DESC LIMIT $2',
      [playerId, limit]
    );
    return result.rows;
  }
}

module.exports = Match;
