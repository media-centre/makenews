/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class HeaderTab extends Component {
    render() {
        return (
            <Link to={this.props.url} >
                <div className={this.props.class} >
                    {this.props.name}
                </div>
            </Link>
        );
    }
}

HeaderTab.propTypes = {
    "name": PropTypes.string.isRequired,
    "url": PropTypes.string.isRequired,
    "class": PropTypes.string.isRequired
};
