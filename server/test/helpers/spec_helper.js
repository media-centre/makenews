import request from 'request';
import './chai';

let dbAdminUrl = "http://test:test@localhost:5984";
export default class Helper {
  static createUser(username, password) {
    return new Promise((resolve) => {
      request.put({
          uri: dbAdminUrl + '/_users/org.couchdb.user:' + username,
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({type: "user", name: username, password: password, roles: []})
        },
      () => {
          resolve();
        });
    });
  }
}
