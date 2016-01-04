"use strict";

import React, { Component, PropTypes } from "react";

export default class ConfirmPopup extends Component {

    handleClick(event, isConfirm) {
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
                            <button className="confirmButton border" ref="confirmButton" onClick={(event)=> this.handleClick(event, true)}>{"Confirm"}</button>
                            <button className="cancelButton border" ref="cancelButton" onClick={(event)=> this.handleClick(event)}>{"Cancel"}</button>
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
    "callback": PropTypes.func.isRequired
};
