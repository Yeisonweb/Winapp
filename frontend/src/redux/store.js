import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import walletReducer from './slices/walletSlice'
import gamesReducer from './slices/gamesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    wallet: walletReducer,
    games: gamesReducer
  }
})

export default store
