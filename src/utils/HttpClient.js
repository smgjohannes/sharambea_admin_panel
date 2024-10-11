import axios from 'axios';
import config from '../config';
import { Token } from './Token';

const MAX_RETRY = 3;

const client = axios.create();

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 429 || error.response.status === 403)
    ) {
      console.log('Something went wrong');
    }

    if (
      error.response &&
      error.response.status &&
      error.response.status !== 412 &&
      error.response.status !== 422 &&
      error.response.status > 399 &&
      error.response.status < 500
    ) {
      console.log(error.response.data.message || 'error_title');
    }

    if (error.response && error.response.status === 500) {
      console.log('error_title');
    }

    console.error(error);

    return Promise.reject(error);
  }
);

export class HttpClient {
  constructor() {
    this.token = new Token();
    this.baseUrl = config.baseUrl || window.location.origin;
  }
  getAxiosHeaders(url) {
    const language = localStorage.getItem('X-LOCALE');
    const headers = {};

    const unprotectedRoutes = ['/properties/all'];

    if (!unprotectedRoutes.includes(url) && this.token.getAccessToken()) {
      headers.authorization = `Bearer ${this.token.getAccessToken()}`;
    }

    if (language) {
      headers['Accept-Language'] = language;
    }

    return headers;
  }
  // getAxiosHeaders() {
  //   const language = localStorage.getItem('X-LOCALE');
  //   const headers = {};

  //   if (this.token.getAccessToken()) {
  //     headers.authorization = `Bearer ${this.token.getAccessToken()}`;
  //   }

  //   if (language) {
  //     headers['Accept-Language'] = language;
  //   }

  //   return headers;
  // }

  async executeQuery(method, url, query, body, retryCount = 0) {
    if (retryCount > MAX_RETRY) {
      this.token.reset();
      throw new Error('MAX_RETRY_EXCEEDED');
    }
    try {
      const response = await axios({
        baseURL: this.baseUrl,
        url,
        method,
        params: query,
        data: body,
        headers: this.getAxiosHeaders(),
      });
      return response;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        return this.executeQuery(method, url, query, body, retryCount + 1);
      }
      throw e;
    }
  }

  async get(url, query) {
    return this.executeQuery('get', url, query);
  }

  async post(url, body) {
    return this.executeQuery('post', url, {}, body);
  }

  async patch(url, body) {
    return this.executeQuery('patch', url, {}, body);
  }

  async delete(url, body) {
    return this.executeQuery('delete', url);
  }
}
