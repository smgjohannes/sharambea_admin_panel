import axios from 'axios';
import config from '../config';

const MAX_RETRY = 3;

export class HttpClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = config.baseUrl || window.location.origin;
  }

  getAxiosHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token.getAccessToken()) {
      headers.authorization = `Bearer ${this.token.getAccessToken()}`;
    }
    return headers;
  }

  async refreshAccessToken() {
    const { data } = await axios({
      baseURL: this.baseUrl,
      url: 'https://sharambeaapi-3cdb242a1398.herokuapp.com/api/v1/access_token',
      method: 'post',
      data: {
        refresh_token: this.token.getRefreshToken(),
      },
    });
    this.token.setAccessToken(data.access_token);
  }

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
        await this.refreshAccessToken();
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
