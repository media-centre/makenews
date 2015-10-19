var helper = require('./helpers/spec_helper');
var Session = require('../src/session');

describe("SessionSpec", function(){
  describe("login", function(){
    it("should login user with given username and password", function(done){
      var username = "srk";
      var password = "password";
      var createUser = helper.createUser(username, password);
      var login = Session.login(username, password);
      var test = function(token){
        expect(token).to.not.equal(undefined);
        expect(token).to.have.string("AuthSession");
        done();
      };

      createUser.then(login.then(test));
    });

    it("should fail if username/password are invalid", function(done){
      var username = "dummy";
      var password = "invalid_password";
      var login = Session.login(username, password);
      var test = function(){
        done();
      };

      login.fail(test);
    });
  });

  describe("currentUser", function() {
    it("should return current user name", function (done) {
      var username = "srk";
      var password = "password";
      var createUser = helper.createUser(username, password);
      var login = Session.login(username, password);
      createUser.then(login.then(function(token){
        Session.currentUser(token).then(function(name){
          expect(name).to.eq(username);
          done();
        });
      }));
    });

    it("should return undefined if user is not logged in", function (done) {
        Session.currentUser("token").fail(function(err){
          done();
        });
    });
  });
});