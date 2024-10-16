import _ from 'lodash';
let env = process.env;

let config = {
  development: {
    homeUrl: 'http://localhost:3001',
    baseUrl: 'http://localhost:4343/api/v1',
  },

  production: {
    homeUrl: 'https://admin.sharambeaprop.com',
    baseUrl: 'https://sharambeaapi-3cdb242a1398.herokuapp.com/api/v1',
  },
};

export default _.extend({}, config.general, config[env.NODE_ENV]);
