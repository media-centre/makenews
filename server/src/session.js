var request = require('request');
var config = require('./config');
var Session = {

  login: function (username, password) {
    return new Promise(function (resolve, reject) {
      request.post({
          uri: config.dbUrl + '/_session',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          body: require('querystring').stringify({name: username, password: password})
        },
        function (error, response, body) {
          if (response.statusCode == 200) {
            resolve(response.headers['set-cookie'][0]);
          }
          else {
            reject(error);
          }
        });
    });
  },

  currentUser: function (token) {
    return new Promise(function (resolve, reject) {
      request.get({
        url: config.dbUrl + '/_session',
        headers: {
          'Cookie': "AuthSession=" + token
        }
      }, function (error, response, body) {
        var userJson = JSON.parse(body);
        if (userJson["userCtx"] && userJson["userCtx"]["name"] != undefined) {
          resolve(userJson["userCtx"]["name"]);
        }
        else {
          reject("null");
        }
      });
    });
  }
};
module.exports = Session;