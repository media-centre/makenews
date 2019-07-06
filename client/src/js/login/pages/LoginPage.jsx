/* eslint react/self-closing-comp:0 */
import Login from "../components/Login";
import { userLogin } from "../LoginActions";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class LoginPage extends Component {

    constructor() {
        super();
        this._userLogin = this._userLogin.bind(this);
    }

    _userLogin(history, userName, password) {
        this.props.dispatch(userLogin(history, userName, password));
    }

    render() {
        const { featuresHelp } = this.props.loginPageStrings;
        return (
            <div className="login-page">
                <div className="row container">
                    <div className="branding">
                        <p>LOCA</p>
                    </div>
                    <div className="login-box">
                        <Login ref="login" onLoginClick={this._userLogin} loginStrings={this.props.loginPageStrings.login} errorMessage={this.props.login.errorMessage} />
                    </div>
                </div>
                <div className="screenshots container">
                </div>
                <div className="details container">
                </div>
            </div>
        );
    }
}

LoginPage.displayName = "LoginPage";
LoginPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "login": PropTypes.object.isRequired,
    "loginPageStrings": PropTypes.object.isRequired
};


function select(store) {
    return { "login": store.login, "loginPageStrings": store.loginPageLocale };
}
export default connect(select)(LoginPage);
