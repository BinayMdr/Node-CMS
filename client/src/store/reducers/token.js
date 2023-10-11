// types
import { createSlice } from '@reduxjs/toolkit';


const token = createSlice({
  name: 'token',
  initialState:{
    value : null
  },
  reducers: {
    addToken(state,action) {
      state.value = action.payload.value;
    },

    removeToken(state) {
      state.value = null;
    }
  }
});

export default token.reducer;

export const { addToken, removeToken } = token.actions;
