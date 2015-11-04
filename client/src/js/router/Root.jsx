/* global __DEVTOOLS__ */
import App from '../App.jsx';
import Home from '../Home.jsx';

import React, { PropTypes } from 'react'
import { Redirect, Route } from 'react-router'
import { ReduxRouter } from 'redux-router'
import { connect } from 'react-redux'
// import { IntlProvider } from 'react-intl'

function getRootChildren (props) {
  const rootChildren = [
      renderRoutes()
  ];

  return rootChildren;
}
function renderRoutes () {
  return (
    <ReduxRouter>
      <Route component={App}>
        <Route path="/" component={App} />
        <Route path="/home" component={Home} />
      </Route>
    </ReduxRouter>
  )
}

export default class Root implements component {


  render () {
    return (
      <div>{getRootChildren(this.props)}</div>
      )
  }
}
