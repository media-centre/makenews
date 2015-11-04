import React, { Component } from 'react';

export default class Login extends Component {
  render() {
    return (
      <form id="login" onSubmit={(e) => this.handleClick(e)}>

          <p id="errorMessage" ref="errorMessage" className="error extra-small-text">{this.props.errorMessage}</p>

          <div className="clear-fix input-container">
              <div className="left m-block">
                  <input type="text" id="userName" placeholder='username' ref='userName' name="userName" className="m-input-block box small-text" required/>
              </div>

              <div className="left m-block password-container">
                  <input type="password" id="password" placeholder='password' ref='password' name="password" className="m-input-block box small-text" required/>
                  <p className="help-login extra-small-text t-right">Need help to login</p>
              </div>

              <div className="left m-block m-t-center">
                  <button id="submit" ref="submit">Login</button>
              </div>
          </div>

      </form>
    );
  }

  handleClick(e) {
    e.preventDefault();
    let  userName = this.refs.userName.value.trim();
    let  password = this.refs.password.value.trim();
    this.props.onLoginClick(userName, password);

  }
}
