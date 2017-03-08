import Login from "../components/Login";
import { userLogin } from "../LoginActions";
import AppSessionStorage from "../../../js/utils/AppSessionStorage";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class LoginPage extends Component {

    static getUserName() {
        return AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.USERNAME);
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div className="login-page">
                <Login ref="login" onLoginClick={(history, userName, password) => dispatch(userLogin(history, userName, password))} loginStrings={this.props.loginPageStrings.login} errorMessage={this.props.login.errorMessage} />
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
