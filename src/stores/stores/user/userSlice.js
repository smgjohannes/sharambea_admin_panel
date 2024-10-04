import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, LoadingStatus } from '../../utils/constants';
import { getDefaultState } from '../../utils/getDefaultState';
import { startLoader, endLoader } from '../../utils/loader';

export const getMySelf = createAsyncThunk('user/getMySelf', async (_, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const response = await getState().token.httpClient.get('/api/v1/me');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getUser = createAsyncThunk('user/getUser', async (selector, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const response = await getState().token.httpClient.get(`/api/v1/users/${selector}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const saveUser = createAsyncThunk('user/saveUser', async (payload, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const response = await getState().token.httpClient.patch('/api/v1/me', payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (payload, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().user;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.post('/api/v1/me/update-password', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateOrganizerProfile = createAsyncThunk(
  'user/updateOrganizerProfile',
  async (payload, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().user;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.patch('/api/v1/me/organizer', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'user/updateUserSettings',
  async (payload, { getState, requestId, rejectWithValue }) => {
    try {
      const { currentRequestId, loading } = getState().user;
      if (loading !== 'pending' || requestId !== currentRequestId) {
        return;
      }
      const response = await getState().token.httpClient.patch('/api/v1/me/update-settings', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMyEvents = createAsyncThunk('user/getMyEvents', async (_, { getState, requestId, rejectWithValue }) => {
  try {
    const { currentRequestId, loading } = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const response = await getState().token.httpClient.get('/api/v1/me/events');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = Object.assign({}, getDefaultState, {
  ProfileGetStatus: null,
  ProfilePatchStatus: null,
  profileUpdateErrors: null,
  passwordUpdateStatus: null,
  userEventsGetStatus: null,
  settingsUpdateStatus: null,
  organizerUpdateStatus: null,
  newUser: null,
  user: null,
  events: [],
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    // get current user
    builder
      .addCase(getMySelf.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.ProfileGetStatus = RequestStatus.Getting;
        }
      })
      .addCase(getMySelf.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.newUser = action.payload;
          state.ProfileGetStatus = RequestStatus.Success;
        }
      })
      .addCase(getMySelf.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.ProfileGetStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // get user
    builder
      .addCase(getUser.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.ProfileGetStatus = RequestStatus.Getting;
        }
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.newUser = action.payload;
          state.ProfileGetStatus = RequestStatus.Success;
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.ProfileGetStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // update user
    builder
      .addCase(saveUser.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.ProfilePatchStatus = RequestStatus.Getting;
        }
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.user = action.payload;
          state.token.saveUser(action.payload);
          state.ProfilePatchStatus = RequestStatus.Success;
        }
      })
      .addCase(saveUser.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.ProfilePatchStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // update account password
    builder
      .addCase(updatePassword.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.passwordUpdateStatus = RequestStatus.Getting;
        }
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.passwordUpdateStatus = RequestStatus.Success;
        }
      })
      .addCase(updatePassword.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.passwordUpdateStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // update organizer profile
    builder
      .addCase(updateOrganizerProfile.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.organizerUpdateStatus = RequestStatus.Getting;
        }
      })
      .addCase(updateOrganizerProfile.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.organizerUpdateStatus = RequestStatus.Success;

          let user = state.token.getUser();
          user.organizer = action.payload;
          state.token.saveUser(user);
        }
      })
      .addCase(updateOrganizerProfile.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.organizerUpdateStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // update settings
    builder
      .addCase(updateUserSettings.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.settingsUpdateStatus = RequestStatus.Getting;
        }
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.settingsUpdateStatus = RequestStatus.Success;
        }
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.settingsUpdateStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });

    // get my events
    builder
      .addCase(getMyEvents.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = LoadingStatus.PENDING;
          state.currentRequestId = action.meta.requestId;
          state.progress = startLoader();
          state.userEventsGetStatus = RequestStatus.Getting;
        }
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.IDLE;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.events = action.payload;
          state.userEventsGetStatus = RequestStatus.Success;
        }
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = LoadingStatus.FAILED;
          state.currentRequestId = undefined;
          state.progress = endLoader();
          state.userEventsGetStatus = RequestStatus.Error;
          state.error = action.payload.message;
        }
      });
  },
});

export default userSlice.reducer;
