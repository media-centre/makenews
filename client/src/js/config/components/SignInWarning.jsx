import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SignInWarning extends Component {
    render() {
        return (
            <div className="sign-in-warning">
                <i className="warning-icon"/>
                <div className="message">
                    { this.props.currentSourceType === "facebook"
                        ? "Please, sign into your facebook account to add Facebook Groups, Pages as your sources"
                        : "Please, sign into your twitter account"
                    }
                </div>
            </div>
        );
    }
}

SignInWarning.propTypes = {
    "currentSourceType": PropTypes.string
};

