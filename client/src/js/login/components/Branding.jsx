import React, { Component, PropTypes } from "react";

export default class Branding extends Component {
    render() {
        return (
            <p className="description small-text" ref="branding">
                {this.props.branding.text}
            </p>
        );
    }
}
Branding.displayName = "Branding Component";
Branding.propTypes = {
    "branding": PropTypes.object.isRequired
};
