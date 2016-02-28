/*eslint react/prefer-es6-class:0*/
"use strict";
import React, { PropTypes } from "react";
import History from "../../History";

export default class Login extends React.Component {

    handleClick(event) {
        event.preventDefault();
        let userName = this.refs.userName.value.trim();
        let password = this.refs.password.value.trim();
        this.props.onLoginClick(History.getHistory(), userName, password);
    }

    render() {
        return (
            <form id="login" onSubmit={(event) => this.handleClick(event)}>

                <p id="errorMessage" ref="errorMessage" className="error extra-small-text">
            {this.props.errorMessage}
                </p>

                <div className="clear-fix input-container">
                    <div className="left m-block">
                        <input type="text" id="userName" placeholder={this.props.loginStrings.userNamePlaceHoder} ref="userName" name="userName" className="m-input-block box small-text" required/>
                    </div>

                    <div className="left m-block password-container">
                        <input type="password" id="password" placeholder={this.props.loginStrings.passwordPlaceHoder} ref="password" name="password" className="m-input-block box small-text" required/>

                    </div>

                    <div className="left m-block m-t-center">
                        <button id="submit" className="login-button border" ref="submit">
                    {this.props.loginStrings.loginButton}
                        </button>
                    </div>
                </div>

            </form>
        );
    }
}

Login.displayName = "Login";

Login.propTypes = {
    "errorMessage": PropTypes.string.isRequired,
    "onLoginClick": PropTypes.func.isRequired,
    "loginStrings": PropTypes.object
};
