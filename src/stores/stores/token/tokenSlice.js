import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus } from '../../utils/constants';
import { getDefaultState } from '../../utils/getDefaultState';
import { startLoader, endLoader } from '../../utils/loader';

export const getTokens = createAsyncThunk('token/getTokens', async (_, { getState, requestId, rejectWithValue }) => {
  try {
    const response = await getState().token.httpClient.get('/api/v1/token');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const revokeToken = createAsyncThunk('token/revoke', async (tokenId, { getState, requestId, rejectWithValue }) => {
  try {
    const response = await getState().token.httpClient.get(`/v1/api/token/${tokenId}/revoke`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = Object.assign({}, getDefaultState, {
  tokensGetStatus: null,
  tokenRevokeStatus: null,
  tokens: [],
});

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getting user tokens
    builder.addCase(getTokens.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
        state.progress = startLoader();
        state.tokensGetStatus = RequestStatus.Getting;
      }
    }).addCase(getTokens.fulfilled, (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.currentRequestId = undefined;
        state.progress = endLoader();
        state.tokensGetStatus = RequestStatus.Success;
        state.tokens.push(action.payload);
      }
    }).addCase(getTokens.rejected, (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.currentRequestId = undefined;
        state.progress = endLoader();
        state.tokensGetStatus = RequestStatus.Error;
        state.error = action.payload.message;
      }
    })

    // revoking a user token
    builder.addCase(revokeToken.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
        state.progress = startLoader();
        state.tokenRevokeStatus = RequestStatus.Getting;
      }
    }).addCase(revokeToken.fulfilled, (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.currentRequestId = undefined;
        state.progress = endLoader();
        state.tokenRevokeStatus = RequestStatus.Success;
        state.tokens = action.tokens;
      }
    }).addCase(revokeToken.rejected, (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.currentRequestId = undefined;
        state.progress = endLoader();
        state.tokenRevokeStatus = RequestStatus.Error;
        state.error = action.payload.message;
      }
    });
  },
});

export default tokenSlice.reducer;
