import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import get from 'get-value';
import { Routes } from '../routes';
import { RequestStatus } from '../utils/constants';
import { getDefaultState } from '../utils/getDefaultState';
const returnUrl = window.location.pathname + window.location.search;

export const checkToken = createAsyncThunk(
  'main/checkToken',
  async (navigate, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().main;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }

      await getState().auth.token.init();
      if (!getState().auth.token.isConnected()) {
        navigate(`/auth/login?return_url=${encodeURIComponent(returnUrl)}`);
      }
      const tasks = [getState().auth.httpClient.get('/api/v1/me')];
      const [user] = await Promise.all(tasks);
      getState().auth.user = user;
    } catch (e) {
      const status = get(e, 'response.status');
      if (status === 401 || status === 403) {
        getState().auth.token.reset();
        navigate(`/auth/login?return_url=${encodeURIComponent(returnUrl)}`);
      }
      return rejectWithValue(e.response.data);
    }
  }
);

export const logout = createAsyncThunk('main/logout', async (navigate, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().main;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const user = getState().auth.token.getUser();
    if (user && user.token_id) {
      await getState().token.httpClient.post(`/api/v1/token/${user.token_id}/revoke`);
    }
    getState().auth.token.reset();
    navigate(Routes.AuthLogin.path);
  } catch (e) {
    return rejectWithValue(e.response.data);
  }
});

export const sendMail = createAsyncThunk(
  'main/sendMail',
  async (formData, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().main;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }

      const response = await getState().token.httpClient.post('/api/v1/mail/send', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = Object.assign({}, getDefaultState, {
  redirectToLogin: false,
  sendMessageStatus: null,
});

export const mainSlice = createSlice({
  name: 'main',
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
  extraReducers: (builder) => {
    builder
      .addCase(checkToken.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
        }
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
        }
      })
      .addCase(checkToken.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.redirectToLogin = true;
        }
      });

    // logout user
    builder
      .addCase(logout.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
        }
      })
      .addCase(logout.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
        }
      })
      .addCase(logout.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.token.reset();
        }
      });

    // send mail
    builder
      .addCase(sendMail.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.sendMessageStatus = RequestStatus.Getting;
        }
      })
      .addCase(sendMail.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.sendMessageStatus = RequestStatus.Success;
        }
      })
      .addCase(sendMail.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.sendMessageStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });
  },
});

export const { startLoader, endLoader } = mainSlice.actions;

export default mainSlice.reducer;
