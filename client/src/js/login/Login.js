import React, { Component, PropTypes } from 'react';

export default class Login extends Component {
  render() {
    return (
      <form id="login" onSubmit={(e) => this.handleClick(e)}>
          <div className="clear-fix input-container">

              <div className="left m-block">
                  <input type="text" id="user_name" placeholder='username' ref='user_name' name="userName" className="m-input-block box small-text" required/>
                  <p className="error extra-small-text">Invalid password or password</p>
              </div>

              <div className="left m-block password-container">
                  <input type="password" id="password" placeholder='password' ref='password' name="password" className="m-input-block box small-text" required/>
                  <p className="help-login extra-small-text t-right">Need help to login</p>
              </div>

              <div className="left m-block m-t-center">
                  <button>Login</button>
              </div>

          </div>

      </form>
    );
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onLoginClick('vikram', 'password');
  }
}
