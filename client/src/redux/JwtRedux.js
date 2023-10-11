import { createSlice } from '@reduxjs/toolkit'

export const jwtRedux = createSlice({
  name: 'jwtToken',
  initialState: {
    value: null,
  },
  reducers: {
    addToken: (state,payload) => {
      state.value = payload
    },
    removeToken: (state) => {
      state.value = null
    }
  },
})

export const { addToken, removeToken } = jwtRedux.actions

export default jwtRedux.reducer