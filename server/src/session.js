import { dbUrl } from './config/DbConfig';
import request from 'request';
import querystring from 'querystring';

export default class Session {
  static login(username, password) {
    return new Promise((resolve, reject) => {
      request.post({
          uri: dbUrl + '/_session',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          body: querystring.stringify({name: username, password: password})
        },
        (error, response) => {
          if (response.statusCode === 200) {
            resolve(response.headers['set-cookie'][0]);
          }
          else {
            reject(error);
          }
        });
    });
  }

  static currentUser(token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: dbUrl + '/_session',
        headers: {
          'Cookie': "AuthSession=" + token
        }
      }, (error, response, body) => {
        let userJson = JSON.parse(body);
        if (userJson.userCtx && userJson.userCtx.name !== null) {
          resolve(userJson.userCtx.name);
        }
        else {
          reject("null");
        }
      });
    });
  }
}
