import {Login} from './login_model';
import $ from 'jquery';
//import riot from 'riot';

$(function() {
  var login = new Login();
  riot.mount('login', { login_model : login });

})
