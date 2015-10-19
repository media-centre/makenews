var request = require('request');
var config = require('../../src/config');
var q = require('q');
require('./chai');
var Helper = {
  createUser: function(username, password) {
    var deferred = q.defer();
    request.put({
        uri: config.dbAdminUrl + '/_users/org.couchdb.user:' + username,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({type: "user", name: username, password: password, roles: []})
      },
      function (error, response, body) {
        deferred.resolve();
      });
    return deferred.promise;
  }
};

module.exports = {createUser: Helper.createUser};