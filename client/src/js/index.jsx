import { connect, Provider } from 'react-redux'
import Login from './Login.jsx'
import App from './App.jsx'
import contentDiscoveryApp from './Reducers.js'
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import 'babel/polyfill';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('login-form-container')
);
