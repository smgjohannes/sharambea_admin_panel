import { HttpClient } from "./HttpClient";
import { Token } from "./Token";
import { LoadingStatus } from '../constants';
const token = new Token();
const httpClient = new HttpClient(token);

const getDefaultState = {
  httpClient,
  token,
  success: null,
  error: null,
  errors: [],
  progress: 0,
  currentRequestId: undefined,
  loading: LoadingStatus.IDLE,
};

export { getDefaultState };
