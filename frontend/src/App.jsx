import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Games from './pages/Games'
import GameRoom from './pages/GameRoom'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'

function App() {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/games" element={isAuthenticated ? <Games /> : <Navigate to="/login" />} />
          <Route path="/game/:gameId" element={isAuthenticated ? <GameRoom /> : <Navigate to="/login" />} />
          <Route path="/wallet" element={isAuthenticated ? <Wallet /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
