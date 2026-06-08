import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setBalance } from '../redux/slices/walletSlice'
import { walletAPI } from '../services/api'

function Dashboard() {
  const { user } = useSelector(state => state.auth)
  const { balance } = useSelector(state => state.wallet)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await walletAPI.getBalance()
        dispatch(setBalance(response.data.balance))
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }
    fetchBalance()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Bienvenido, {user?.username}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Saldo Total</h3>
          <p className="text-4xl font-bold text-green-500">${balance.toFixed(2)}</p>
        </div>
        
        <Link to="/wallet" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700">
          <h3 className="text-gray-400 mb-2">💰 Depósito</h3>
          <p className="text-lg">Añade fondos a tu cuenta</p>
        </Link>
        
        <Link to="/games" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700">
          <h3 className="text-gray-400 mb-2">🎮 Jugar Ahora</h3>
          <p className="text-lg">Únete a una partida</p>
        </Link>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Juegos Disponibles</h2>
        <p className="text-gray-400">Monopolio • Póker • Dados • Blackjack y más</p>
      </div>
    </div>
  )
}

export default Dashboard
