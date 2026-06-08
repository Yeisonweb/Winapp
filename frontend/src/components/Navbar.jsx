import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

function Navbar() {
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-500">🎮 WinApp</Link>
        
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-green-500">Dashboard</Link>
              <Link to="/games" className="hover:text-green-500">Juegos</Link>
              <Link to="/wallet" className="hover:text-green-500">Billetera</Link>
              <Link to="/profile" className="hover:text-green-500">Perfil</Link>
              <button onClick={() => dispatch(logout())} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-500">Login</Link>
              <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
