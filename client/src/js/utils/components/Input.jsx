import React, { Component, PropTypes } from "react";

export default class Input extends Component {
    render() {
        return (
            <div className={this.props.className}>
                <div className="input-container">
                    <input ref="hashtag" className="input-tag" type="text" placeholder={this.props.placeholder} {...this.props.eventHandlers} />
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
    "eventHandlers": PropTypes.object,
    "className": PropTypes.string.isRequired
};
