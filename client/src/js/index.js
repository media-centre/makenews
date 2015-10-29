import { connect, Provider } from 'react-redux'
import Login from './login/Login.js'
import App from './App.js'
import contentDiscoveryApp from './Reducers.js'
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import 'babel/polyfill';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

ReactDOM.render(
  <Provider store={store}>
    <App name = {'vikram'}/>
  </Provider>,
  document.getElementById('login-form-container')
);
