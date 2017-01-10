import React, { Component, PropTypes } from "react";

export default class Input extends Component {
    render() {
        return (
            <div className="input-box">
                <div className="input-container">
                    <input type="text" placeholder={this.props.placeholder} {...this.props.eventHandlers} />
                    <span className="input-addon">
                        <img src={this.props.addonSrc} />
                    </span>
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    "addonSrc": PropTypes.string,
    "placeholder": PropTypes.string.isRequired,
    "eventHandlers": PropTypes.object
};
