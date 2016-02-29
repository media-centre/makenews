"use strict";

import React, { Component, PropTypes } from "react";

export default class ConfirmPopup extends Component {

    handleClick(event, isConfirm) {
        this.refs.confirmButton.disabled = true;
        this.refs.cancelButton.disabled = true;
        event.OK = isConfirm || false;
        this.props.callback(event);
    }

    render() {
        return (
            <div className="confirm-mask mask">
                <div className="confirm-popup bottom-box-shadow">
                    <div className="container">
                        <p className="description" ref="description">{this.props.description}</p>
                        <div className="button-container t-right">
                            <button className={this.props.hide ? "confirmButton btn-primary hide" : "confirmButton btn-primary"} ref="confirmButton" onClick={(event)=> this.handleClick(event, true)} >{"Confirm"}</button>
                            <button className="cancelButton btn-primary" ref="cancelButton" onClick={(event)=> this.handleClick(event)}>{this.props.hide ? "OK" : "Cancel"}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ConfirmPopup.displayName = "ConfirmPopup";
ConfirmPopup.propTypes = {
    "description": PropTypes.string,
    "callback": PropTypes.func.isRequired,
    "hide": PropTypes.bool
};
ConfirmPopup.defaultProps = {
    "hide": false
};
