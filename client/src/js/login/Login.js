import React, { Component, PropTypes } from 'react';

export default class Login extends Component {
  render() {
    return (
      <form id="login" onSubmit={(e) => this.handleClick(e)}>
        <input id="user_name" placeholder='Username' ref='user_name'/>
        <input type="password" id="password" placeholder='Password' ref='password'/>
        <button>submit</button>
      </form>
    );
  }

  handleClick(e) {
    e.preventDefault();
    console.log(this.refs.user_name.value.trim());
    console.log(this.refs.password.value.trim());
  }

  
}
