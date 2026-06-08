import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  games: [],
  selectedGame: null,
  loading: false,
  error: null
}

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action) => {
      state.games = action.payload
    },
    setSelectedGame: (state, action) => {
      state.selectedGame = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setGames, setSelectedGame, setLoading, setError } = gamesSlice.actions
export default gamesSlice.reducer
