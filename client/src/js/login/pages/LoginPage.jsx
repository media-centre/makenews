/*eslint max-len:[0,500] */
"use strict";
import Login from "../components/Login.jsx";
import Branding from "../components/Branding.jsx";
import FeaturesHelp from "../components/FeaturesHelp.jsx";
import { userLogin } from "../LoginActions.js";
import Logo from "../../utils/components/Logo.jsx";
import AppSessionStorage from "../../../js/utils/AppSessionStorage";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class LoginPage extends Component {

    componentWillMount() {
        document.getElementsByTagName("html")[0].classList.add("login-bg");
    }

    componentWillUnmount() {
        document.getElementsByTagName("html")[0].classList.remove("login-bg");
    }

    static getUserName() {
        return AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.USERNAME);
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div>
                <header className="app-header login">
                    <div className="clear-fix form-container">
                        <Logo ref="logo"/>
                        <div id="login-form-container" className="login-form-container right m-block">
                            <Login ref="login" onLoginClick={(history, userName, password) => dispatch(userLogin(history, userName, password))} loginStrings={this.props.loginPageStrings.login} errorMessage={this.props.login.errorMessage} />
                        </div>
                    </div>
                    <Branding ref="branding" branding={this.props.loginPageStrings.branding}/>
                </header>

                <section className="login app-section container">
                    <div className="container t-center">
                        <FeaturesHelp ref="featuresHelp" featuresHelp={this.props.loginPageStrings.featuresHelp} />
                    </div>
                </section>


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
