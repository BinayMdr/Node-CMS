// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  userData: null,
  branchData: null,
  accessModuleData: []
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
    },

    addAccessModuleData(state,action)
    {
      state.accessModuleData = action.payload.accessModuleData
    }
  }
});

export default userDetails.reducer;

export const { addUserData, addBranchData, addAccessModuleData} = userDetails.actions;
