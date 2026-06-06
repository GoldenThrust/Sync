import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: null,
  loading: false,
  error: null,
  response: null,
};


const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
    },
    sessionError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.response = null;
    },
    sessionResponse: (state, action) => {
      state.loading = false;
      state.response = action.payload.response;
      state.token = action.payload.token;
      state.error = null;
    }
  }
});

export const { loading, sessionError, sessionResponse } = sessionSlice.actions;

export default sessionSlice.reducer;
