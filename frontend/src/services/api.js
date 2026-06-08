import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL
})

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const authAPI = {
  register: (email, password, username) => api.post('/auth/register', { email, password, username }),
  login: (email, password) => api.post('/auth/login', { email, password })
}

// Users
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
}

// Wallet
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  depositPayPal: (amount) => api.post('/wallet/deposit/paypal', { amount }),
  executePayPalDeposit: (paymentId, payerId, amount) => api.post('/wallet/deposit/paypal/execute', { paymentId, payerId, amount }),
  withdraw: (amount, method, accountEmail) => api.post('/wallet/withdraw', { amount, method, accountEmail }),
  getTransactionHistory: () => api.get('/wallet/history')
}

// Games
export const gamesAPI = {
  getAll: () => api.get('/games'),
  getById: (gameId) => api.get(`/games/${gameId}`)
}

// Matchmaking
export const matchmakingAPI = {
  joinQueue: (gameId, betAmount) => api.post('/matchmaking/join-queue', { gameId, betAmount }),
  leaveQueue: (gameId, betAmount) => api.post('/matchmaking/leave-queue', { gameId, betAmount })
}

export default api
