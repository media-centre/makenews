import $ from 'jquery';
export let Session = {
  login: (username, password) => {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/login',
      data: {username: username, password: password},
      success: function(data, textStatus, request){
        localStorage.setItem("user", username);
      },
      error: function (request, textStatus, errorThrown) {
        alert(request.getResponseHeader('some_header'));
      }
    });
  }
};