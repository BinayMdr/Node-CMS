// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  globalName: null
};

// ==============================|| SLICE - MENU ||============================== //

const globalSetting = createSlice({
  name: 'globalSetting',
  initialState,
  reducers: {
    updateGlobalName(state, action) {
      state.globalName = action.payload.globalName;
      console.log(action.payload.globalName)
    }
  }
});

export default globalSetting.reducer;

export const { updateGlobalName } = globalSetting.actions;
