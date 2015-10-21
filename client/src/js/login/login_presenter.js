import $ from 'jquery';
var Session = require('./session.js');

$( document ).ready(function() {
  riot.mount("login", { session_model: Session });
});
