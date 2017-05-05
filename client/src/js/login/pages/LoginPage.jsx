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
                        <img className="logo" alt="makenews" src="./images/makenews-logo.png"/>
                        <p className="makenews-desc">
                            {this.props.loginPageStrings.branding.text}
                        </p>
                        <button className="get-started btn primary lg">
                            {this.props.loginPageStrings.getStarted}
                        </button>
                        <a href="#" className="watch-demo">
                            <i className="arrow fa fa-caret-right" aria-hidden="true"/> {this.props.loginPageStrings.watchDemo}
                        </a>
                    </div>
                    <div className="login-box">
                        <Login ref="login" onLoginClick={this._userLogin} loginStrings={this.props.loginPageStrings.login} errorMessage={this.props.login.errorMessage} />
                    </div>
                </div>
                <div className="screenshots container">
                    <img src="./images/banner.png" alt="configuration, scan news and write a story thumbnails"/>
                </div>
                <div className="details container">
                    <div className="page">
                        <h2>{featuresHelp.configureHelp.name}</h2>
                        <p className="description">{featuresHelp.configureHelp.text}</p>
                    </div>
                    <div className="page">
                        <h2>{featuresHelp.scanNewsHelp.name}</h2>
                        <p className="description">{featuresHelp.scanNewsHelp.text}</p>
                    </div>
                    <div className="page">
                        <h2>{featuresHelp.writeStoryHelp.name}</h2>
                        <p className="description">{featuresHelp.writeStoryHelp.text}</p>
                    </div>
                </div>
                <div className="empty-box"></div>
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
