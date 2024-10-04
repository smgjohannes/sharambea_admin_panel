import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progress: 0,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoader: (state) => {
      let i = Math.floor(Math.random() * 40) + 10;
      state.progress = i;
    },
    endLoader: (state) => {
      state.progress = 100;
    },
  },
});

export const { startLoader, endLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
