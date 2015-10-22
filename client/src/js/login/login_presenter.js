import $ from 'jquery';
var Session = require('./session.js');

$(function() {
  if(localStorage.getItem("user") === null) {
    riot.mount("login", {session_model: Session});
  }
});