import { Session } from '../../src/js/login/session';
import sinon from 'sinon';
import $ from 'jquery';
import riot from 'riot';

describe('Session', () => {
  describe('login', () => {
    it('should login the user if username and password is correct', () => {
      $.ajax = (options) => {
        var successCallback = options.success;
        successCallback("done");
      };
      var username = "vinod";
      var successPromise = Session.login(username, "123");
      successPromise.done((msg) => {
        expect(msg).to.equal("Logged in successfully")
      });
      expect(localStorage.getItem("user")).to.equal(username);
    });

    it('should show error on invalid login', () => {
      $.ajax = (options) => {
        var failureCallback = options.error;
        failureCallback("{Error:'unauthorized'}");
      };
      var rejectedPromise = Session.login("InvalidUser", "qwerty");
      rejectedPromise.fail((error) => {
        expect(error).to.equal("Username or password invalid");
      });
    });

    it('should show error if username is blank', (done) => {
      var rejectedPromise = Session.login("", "password");
      rejectedPromise.fail((error) => {
        expect(error).to.equal("Please enter username and password");
        done();
      });
    });

    it('should show error if password is blank', (done) => {
      var rejectedPromise = Session.login("username", "");
      rejectedPromise.fail((error) => {
        expect(error).to.equal("Please enter username and password");
        done();
      });
    });
  });
});