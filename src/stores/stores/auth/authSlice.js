import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import get from 'get-value';
import { startLoader, endLoader } from '../../utils/loader';
import { getDefaultState } from '../../utils/getDefaultState';
import { RequestStatus, LoginStatus, ForgotPasswordStatus, ResetPasswordStatus } from '../../utils/constants';

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().auth;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.post('/api/v1/auth', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (params, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().auth;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const { formData, navigate } = params;
    const response = await getState().token.httpClient.post('/api/v1/auth/login', formData);
    const data = response.data;
    if (!data.requireVerification) navigate(`/`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (formData, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().auth;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.post('/api/v1/auth/forgot-password', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().auth;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const { token, formData } = payload;
      const response = await getState().token.httpClient.post(`/api/v1/auth/reset-password?token=${token}`, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resendActivation = createAsyncThunk(
  'auth/resendActivation',
  async (identity, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().auth;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.post(`/api/v1/auth/resendConfirmation?identity=${identity}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const confirmEmail = createAsyncThunk(
  'auth/confirmEmail',
  async (token, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().auth;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.post(`/api/v1/auth/confirmEmail?token=${token}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = Object.assign({}, getDefaultState, {
  registerStatus: null,
  loginStatus: null,
  forgotPasswordStatus: null,
  resetPasswordStatus: null,
  activateStatus: null,
  resendActivationStatus: null,
  requireVerification: null,
  notVerified: null,
  user: null,
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // sign up
    builder
      .addCase(register.pending, (action, state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.registerStatus = RequestStatus.Getting;
        }
      })
      .addCase(register.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.registerStatus = RequestStatus.Success;
          state.token.saveUser(action.payload);
          state.token.init();
        }
      })
      .addCase(register.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.registerStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // login
    builder
      .addCase(login.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.loginStatus = LoginStatus.Processing;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.loginStatus = LoginStatus.LoginSuccess;
          if (action.payload.requireVerification) {
            state.requireVerification = action.payload.requireVerification;
          } else {
            state.user = action.payload;
            state.token.saveUser(action.payload);
            state.token.init();
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.loginStatus = LoginStatus.WrongCredentialsError;
          state.error = action.payload.message;
          state.errors = action.payload;

          const status = get(action.payload, 'status');
          if (!status) {
            state.loginStatus = RequestStatus.NetworkError;
          } else if (status === 404) {
            state.loginStatus = LoginStatus.UserNotFound;
          } else if (status === 429) {
            state.loginStatus = RequestStatus.RateLimitError;
          } else {
            state.loginStatus = RequestStatus.Error;
          }
        }
      });

    // forgot password
    builder
      .addCase(forgotPassword.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.forgotPasswordStatus = ForgotPasswordStatus.Getting;
        }
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.progress = endLoader();
          state.forgotPasswordStatus = ForgotPasswordStatus.Success;
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          const status = get(action.payload, 'status');

          if (!status) {
            state.forgotPasswordStatus = RequestStatus.NetworkError;
          } else if (status === 404) {
            state.forgotPasswordStatus = ForgotPasswordStatus.UserNotFound;
          } else if (status === 403) {
            state.forgotPasswordStatus = RequestStatus.PendingResetRequest;
          } else if (status === 429) {
            state.forgotPasswordStatus = RequestStatus.RateLimitError;
          } else {
            state.forgotPasswordStatus = RequestStatus.Error;
          }
          state.error = action.payload.message;
        }
      });

    // reset password
    builder
      .addCase(resetPassword.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.resetPasswordStatus = RequestStatus.Getting;
        }
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.progress = endLoader();
          state.resetPasswordStatus = RequestStatus.Success;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          const status = get(action.payload, 'status');
          state.progress = endLoader();
          if (!status) {
            state.resetPasswordStatus = RequestStatus.NetworkError;
          } else if (status === 404) {
            state.resetPasswordStatus = ResetPasswordStatus.UserNotFound;
          } else if (status === 429) {
            state.resetPasswordStatus = RequestStatus.RateLimitError;
          } else {
            state.resetPasswordStatus = RequestStatus.Error;
          }
          state.error = action.payload.message;
        }
      });

    // resend activation
    builder
      .addCase(resendActivation.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.resendActivationStatus = RequestStatus.Getting;
        }
      })
      .addCase(resendActivation.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.progress = endLoader();
          state.resendActivationStatus = RequestStatus.Success;
        }
      })
      .addCase(resendActivation.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.resendActivationStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // confirm email
    builder
      .addCase(confirmEmail.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.activateStatus = RequestStatus.Getting;
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
        }
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.activateStatus = RequestStatus.Success;
        }
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.activateStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });
  },
});

export default authSlice.reducer;
