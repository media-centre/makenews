var helper = require('./helpers/spec_helper');
var Session = require('../src/session');

describe("SessionSpec", () => {
  describe("login", () => {
    it("should login user with given username and password", (done) => {
      var username = "srk";
      var password = "password";
      var createUser = helper.createUser(username, password);
      createUser.then(() => {
        Session.login(username, password).then((token) => {
          expect(token).to.not.equal(undefined);
          expect(token).to.have.string("AuthSession");
          done();
        });
      });
    });

    it("should fail if username/password are invalid", (done) => {
      var username = "dummy";
      var password = "invalid_password";
      var login = Session.login(username, password);
      var test = () => {
        done();
      };

      login.catch(test);
    });
  });

  describe("currentUser", () => {
    it("should return current user name", (done) => {
      var username = "srk";
      var password = "password";
      var createUser = helper.createUser(username, password);
      createUser.then(() => {
        Session.login(username, password).then((cookie) => {
          token = cookie.split(";")[0].substring(12);
          Session.currentUser(token).then((name) => {
            expect(name).to.eq(username);
            done();
          });
        })
      });
    });

    it("should return undefined if user is not logged in", (done) => {
      Session.currentUser("token").catch((err) => {
        done();
      });
    });
  });
});