import $ from 'jquery';
import q from 'q';
export let Session = {
  login: (username, password) => {
    var deferred = q.defer();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/login',
      data: {username: username, password: password},
      success: function (data, textStatus, request) {
        localStorage.setItem("user", username);
        deferred.resolve("Logged in successfully");
      },
      error: function (request, textStatus, errorThrown) {
        deferred.reject("Username or password invalid");
      }
    });
    return deferred.promise;
  }
};