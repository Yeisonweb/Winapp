import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { gamesAPI, matchmakingAPI, walletAPI } from '../services/api'

function GameRoom() {
  const { gameId } = useParams()
  const { user } = useSelector(state => state.auth)
  const [game, setGame] = useState(null)
  const [betAmount, setBetAmount] = useState('0.50')
  const [inQueue, setInQueue] = useState(false)
  const [socket, setSocket] = useState(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await gamesAPI.getById(gameId)
        setGame(response.data.game)
      } catch (error) {
        console.error('Error fetching game:', error)
      }
    }

    const fetchBalance = async () => {
      try {
        const response = await walletAPI.getBalance()
        setBalance(response.data.balance)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }

    fetchGame()
    fetchBalance()

    // Socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
    setSocket(newSocket)

    return () => newSocket.close()
  }, [gameId])

  const handleJoinQueue = async () => {
    try {
      const amount = parseFloat(betAmount)
      const response = await matchmakingAPI.joinQueue(gameId, amount)
      setInQueue(true)
    } catch (error) {
      console.error('Error joining queue:', error)
    }
  }

  if (!game) return <div className="text-center p-8">Cargando juego...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">{game.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Descripción</h3>
          <p className="text-gray-400 mb-4">{game.description}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Tu Saldo: ${balance.toFixed(2)}</label>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Selecciona tu Apuesta</label>
              <select
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="0.50">$0.50 (Gana $1.00)</option>
                <option value="5">$5.00 (Gana $10.00)</option>
                <option value="20">$20.00 (Gana $40.00)</option>
                <option value="50">$50.00 (Gana $100.00)</option>
              </select>
            </div>
            
            <button
              onClick={handleJoinQueue}
              disabled={inQueue || balance < parseFloat(betAmount)}
              className="w-full bg-green-600 p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-600"
            >
              {inQueue ? 'Esperando oponente...' : 'Unirse a Cola'}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Arena de Juego</h3>
          <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
            <p className="text-gray-500">Área de juego</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameRoom
