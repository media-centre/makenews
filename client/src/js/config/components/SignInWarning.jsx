import React, { Component } from "react";
import PropTypes from "prop-types";
import Locale from "./../../utils/Locale";

export default class SignInWarning extends Component {
    _warningMessage(message, fun, signIn) {
        return (
            <div><div>{message}</div>
                <button onClick={fun} className="sign-in">
                    <i className="fa fa-arrow-right"/> {signIn}
                </button>
            </div>
        );
    }
    render() {
        const messages = Locale.applicationStrings().messages;
        return (
            <div className="sign-in-warning">
                <i className="warning-icon"/>
                <div className="message">
                    { this.props.currentSourceType === "facebook"
                        ? this._warningMessage(messages.facebook.signInWarning, this.props.fbLogin, messages.configurePage.header.signIn)
                        : this._warningMessage(messages.twitter.signInWarning, this.props.twitterLogin, messages.configurePage.header.signIn)
                    }
                </div>
            </div>
        );
    }
}

SignInWarning.propTypes = {
    "currentSourceType": PropTypes.string,
    "fbLogin": PropTypes.func,
    "twitterLogin": PropTypes.func
};

