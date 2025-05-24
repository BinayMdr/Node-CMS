// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  userData: null,
  branchData: null
};

// ==============================|| SLICE - MENU ||============================== //

const userDetails = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    addUserData(state, action) {
      state.userData = action.payload.userData;
    },

    addBranchData(state, action) {
      state.branchData = action.payload.branchData;
    }
  }
});

export default userDetails.reducer;

export const { addUserData, addBranchData} = userDetails.actions;
