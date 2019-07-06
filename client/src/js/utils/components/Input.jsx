import React, { Component } from "react";
import PropTypes from "prop-types";
import StringUtil from "./../../../../../common/src/util/StringUtil";

export default class Input extends Component {

    constructor() {
        super();
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(event) {
        const ENTER_KEY = 13;
        if (StringUtil.isEmptyString(this.refs.input.value) || event.keyCode === ENTER_KEY) {
            this.props.callback(event);
        }
    }

    render() {
        return (
            <div className={this.props.className} />
        );
    }
}

Input.propTypes = {
    "addonSrc": PropTypes.string,
    "placeholder": PropTypes.string.isRequired,
    "callback": PropTypes.func,
    "callbackOnEnter": PropTypes.bool,
    "className": PropTypes.string.isRequired,
    "autoFocus": PropTypes.bool
};
