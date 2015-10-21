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
      Session.login(username, "123");

      expect(localStorage.getItem("user")).to.equal(username);
      // new pouch with userdb
      // riot tag
    });

    it('should show error on invalid login', () => {
      // fail
      // show error in the login tag
    });
  });
});