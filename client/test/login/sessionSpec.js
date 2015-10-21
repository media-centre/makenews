import { Session } from '../../src/js/login/session';
import sinon from 'sinon';
import $ from 'jquery';
import riot from 'riot';

describe('Session', () => {
  describe('login', () => {
    it('should login the user if username and password is correct', () => {
      $.ajax = function(options) {
        var successCallback = options.success;
        successCallback("done");
      };
      var username = "vinod";
      var successPromise = Session.login(username, "123");
      successPromise.done(function(msg){
        expect(msg).to.equal("Logged in successfully")
      });
      expect(localStorage.getItem("user")).to.equal(username);
    });

    it('should show error on invalid login', () => {
      $.ajax = function(options) {
        var failureCallback = options.error;
        failureCallback("{Error:'unauthorized'}");
      };
      var rejectedPromise = Session.login("InvalidUser", "qwerty");
      rejectedPromise.fail(function(error){
        expect(error).to.equal("Username or password invalid");
      });
      expect(rejectedPromise).to.be.rejected;
    });
  });
});