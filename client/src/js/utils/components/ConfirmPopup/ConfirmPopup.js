/* eslint react/jsx-wrap-multilines:0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Locale from "../../Locale";

export default class ConfirmPopup extends Component {

    handleClick(event, isConfirm) {
        this.refs.confirmButton.disabled = true;
        this.refs.cancelButton.disabled = true;
        this.props.callback(isConfirm || false);
    }

    render() {
        let confirmMessages = Locale.applicationStrings().messages.confirmPopup;
        return (
            <div className="confirm-mask mask">
                <div className="confirm-popup bottom-box-shadow">
                    <div className="container">
                        <p className="description" ref="description">{this.props.description}</p>
                        <div className="button-container t-right">
                            <button className={this.props.hide ? "confirmButton hide" : "confirmButton"} ref="confirmButton" onClick={(event)=> this.handleClick(event, true)} >{confirmMessages.confirm}</button>
                            <button className="cancelButton" ref="cancelButton" onClick={(event)=> this.handleClick(event)}>{this.props.hide ? confirmMessages.ok : confirmMessages.cancel}</button>
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
