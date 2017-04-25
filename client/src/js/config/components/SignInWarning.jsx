import React, { Component } from "react";
import PropTypes from "prop-types";
import Locale from "./../../utils/Locale";

export default class SignInWarning extends Component {
    render() {
        const messages = Locale.applicationStrings().messages;
        return (
            <div className="sign-in-warning">
                <i className="warning-icon"/>
                <div className="message">
                    { this.props.currentSourceType === "facebook"
                        ? messages.facebook.signInWarning
                        : messages.twitter.signInWarning
                    }
                </div>
            </div>
        );
    }
}

SignInWarning.propTypes = {
    "currentSourceType": PropTypes.string
};

