var request = require('request');
var config = require('../../src/config');
require('./chai');
var Helper = {
  createUser: (username, password) => {
    return new Promise((resolve, reject) => {
      request.put({
          uri: config.dbAdminUrl + '/_users/org.couchdb.user:' + username,
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({type: "user", name: username, password: password, roles: []})
        },
      (error, response, body) => {
          resolve();
        });
    });
  }
};

module.exports = {createUser: Helper.createUser};