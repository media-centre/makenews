import React, { Component, PropTypes } from 'react';

export default class Login extends Component {
  render() {
    return (
      <form id="login" onSubmit={(e) => this.handleClick(e)}>
          <div>
              <input type="text" id="user_name" placeholder='username' ref='user_name' name="userName"/>
              <input type="password" id="password" placeholder='password' ref='password' name="password"/>
              <button>Login</button>
          </div>
          <div className="help-panel two-column clear-fix">
              <span id="test" className="error extra-small-text left">Invalid password or password</span>
              <span className="help-login extra-small-text left">Need help to login</span>
          </div>
      </form>
    );
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onLoginClick('vikram', 'swa');
  }
}
