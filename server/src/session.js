var request = require('request');
var q = require('q');
var config = require('./config');
var Session = {
  login: function(username, password){
    var deferred = q.defer();
    request.post({
        uri: config.dbUrl + '/_session',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        body: require('querystring').stringify({name: username, password: password})
      },
      function (error, response, body) {
        if(response.statusCode == 200) {
          deferred.resolve(response.headers['set-cookie'][0]);
        }
        else {
          deferred.reject(error);
        }
      });
    return deferred.promise;
  },

  currentUser: function (token) {
    var deferred = q.defer();

    request.get({
      url: 'http://localhost:5984/_session',
      headers: {
        'Cookie': "AuthSession="+token
      }
    }, function (error, response, body) {
      var userJson = JSON.parse(body);
      if(userJson["userCtx"] && userJson["userCtx"]["name"] != undefined){
        deferred.resolve(userJson["userCtx"]["name"]);
      }
      else {
        deferred.reject("null");
      }
    });
    return deferred.promise;
  }
};

module.exports = Session;