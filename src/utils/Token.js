import { Dispatcher } from './Dispatcher';

class Token {
  constructor() {
    this.user = null;
    this.initialized = false;
    this.dispatcher = new Dispatcher();
  }

  init() {
    if (this.initialized) {
      return null;
    }
    const user = this.getUser();
    if (user && this.user.access_token) {
      this.initialized = true;
    }
  }

  reset() {
    this.user = null;
    this.initialized = false;
    localStorage.clear();
  }

  isConnected() {
    return this.user !== null;
  }

  getUser() {
    if (this.user) {
      return this.user;
    }
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    }
    return this.user;
  }

  getRefreshToken() {
    if (this.user) {
      return this.user.refresh_token;
    }
    return null;
  }

  getAccessToken() {
    if (this.user) {
      return this.user.access_token;
    }
    return null;
  }

  setAccessToken(accessToken) {
    const newUser = Object.assign({}, this.user, {
      access_token: accessToken,
    });
    this.saveUser(newUser);
  }

  saveUser(user) {
    const mergedUser = Object.assign({}, this.user, user);
    this.user = mergedUser;
    localStorage.setItem('user', JSON.stringify(mergedUser));
  }
}

export { Token };
