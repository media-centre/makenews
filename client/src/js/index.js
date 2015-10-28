import { connect, Provider } from 'react-redux'
import Login from './login/Login.js'
import App from './App.js'
import contentDiscoveryApp from './Reducers.js'
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore } from 'redux';

let store = createStore(contentDiscoveryApp);

ReactDOM.render(
  <Provider store={store}>
    <App name = {'vikram'}/>
  </Provider>,
  document.getElementById('login-form-container')
);
