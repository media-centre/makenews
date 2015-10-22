import $ from 'jquery';
var Session = require('./session.js');

$( document ).ready(function() {
  if(localStorage.getItem("user") == undefined)
    riot.mount("login", { session_model: Session });
});
