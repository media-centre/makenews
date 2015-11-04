import {Provider } from 'react-redux';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import contentDiscoveryApp from './Reducers.js';
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import 'babel/polyfill';

import Router, {Route} from 'react-router';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

function renderRoutes() {
  return (
    <Route component={App}>
      <Route path="/" component={LoginPage} />
    </Route>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router>{renderRoutes()}</Router>
  </Provider>,
  document.getElementById('main')
);
