import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setGames } from '../redux/slices/gamesSlice'
import { gamesAPI } from '../services/api'

function Games() {
  const { games } = useSelector(state => state.games)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gamesAPI.getAll()
        dispatch(setGames(response.data.games || []))
      } catch (error) {
        console.error('Error fetching games:', error)
      }
    }
    fetchGames()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">🎮 Juegos Disponibles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <Link key={game.id} to={`/game/${game.id}`} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
            <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
            <p className="text-gray-400 mb-4">{game.description}</p>
            <div className="flex justify-between text-sm">
              <span>Min: ${game.min_bet}</span>
              <span>Max: ${game.max_bet}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Games
