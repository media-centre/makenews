import helper from './helpers/spec_helper';
import Session from '../src/session';

describe("SessionSpec", () => {
  describe("login", () => {
    it("should login user with given username and password", (done) => {
      let username = "srk";
      let password = "password";
      let createUser = helper.createUser(username, password);
      createUser.then(() => {
        Session.login(username, password).then((token) => {
          expect(token).to.not.equal(undefined);
          expect(token).to.have.string("AuthSession");
          done();
        });
      });
    });

    it("should fail if username/password are invalid", (done) => {
      let username = "dummy";
      let password = "invalid_password";
      let login = Session.login(username, password);
      let test = () => {
        done();
      };

      login.catch(test);
    });
  });

  describe("currentUser", () => {
    it("should return current user name", (done) => {
      let username = "srk";
      let password = "password";
      let createUser = helper.createUser(username, password);
      createUser.then(() => {
        Session.login(username, password).then((cookie) => {
          let token = cookie.split(";")[0].substring(12);
          Session.currentUser(token).then((name) => {
            expect(name).to.eq(username);
            done();
          });
        });
      });
    });

    it("should return undefined if user is not logged in", (done) => {
      Session.currentUser("cmlub2Q6NTYyOEM0Q0Y674hIiGA9xPnFJn-vr75SIjlPJYc").catch(() => {
        done();
      });
    });
  });
});