import React from "react";
import PropTypes from "prop-types";
import History from "../../History";

export default class Login extends React.Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        let userName = this.refs.userName.value.trim();
        let password = this.refs.password.value.trim();
        this.props.onLoginClick(History.getHistory(), userName, password);
    }

    render() {
        return (
            <form className="login" onSubmit={this.handleClick}>
                <p id="errorMessage" ref="errorMessage" className="error extra-small-text">
                    {this.props.errorMessage}
                </p>

                <div className="input-container">
                    <input tabIndex="1" type="text" id="userName" placeholder={this.props.loginStrings.userNamePlaceHolder} ref="userName" name="userName" className="username" required/>
                    <input tabIndex="1" type="password" id="password" placeholder={this.props.loginStrings.passwordPlaceHolder} ref="password" name="password" className="password" required/>
                    <button tabIndex="1" id="submit" type="submit" className="btn primary lg" ref="submit">
                        {this.props.loginStrings.loginButton}
                    </button>
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
