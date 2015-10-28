import { connect} from 'react-redux'
import Login from './login/Login.js'
import { userLogin } from './Actions';
import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  render() {
    const { dispatch, state } = this.props;
    console.log(this.props);
     return (
        <div>
          <Login test={"testing"} onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} />
        </div>
      );
  }
}

function select(store) {
  return store;
}
export default connect(select)(App);
