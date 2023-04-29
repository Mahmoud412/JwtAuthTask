import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
  loginError: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    init: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    loginSuccess: state => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
    },
    onLogOut: state => {
      state.isLoggedIn = false;
    },
  },
});
export const {init, loginSuccess, onLogOut} = authSlice.actions;

export default authSlice.reducer;
