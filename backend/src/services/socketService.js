const Match = require('../models/match');
const Wallet = require('../models/wallet');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log(`🎮 User connected: ${socket.id}`);

    // Usuario se une a una sala de partida
    socket.on('join-match', (data) => {
      socket.join(data.matchId);
      socket.emit('match-joined', { matchId: data.matchId });
    });

    // Evento del juego
    socket.on('game-action', (data) => {
      io.to(data.matchId).emit('opponent-action', {
        userId: data.userId,
        action: data.action,
        timestamp: new Date()
      });
    });

    // Fin de la partida
    socket.on('match-end', async (data) => {
      try {
        const { matchId, winnerId, betAmount } = data;
        const match = await Match.endMatch(matchId, winnerId);
        const potAmount = betAmount * 2;

        // Dar premio al ganador
        const wallet = await Wallet.findByUserId(winnerId);
        // Aquí deberías actualizar la billetera con el premio

        io.to(matchId).emit('match-completed', {
          matchId,
          winnerId,
          potAmount
        });
      } catch (error) {
        console.error('Error ending match:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
