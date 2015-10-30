import { connect} from 'react-redux'
import Login from './login/Login.js'
import { userLogin } from './Actions';
import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  render() {
    const { dispatch, login } = this.props;
     return (
        <div>
          <Login onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={login.errorMessage} />
        </div>
      );
  }
}

function select(store) {
  return store;
}
export default connect(select)(App);
