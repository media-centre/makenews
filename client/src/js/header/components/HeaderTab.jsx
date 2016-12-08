/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class HeaderTab extends Component {
    render() {
        return (
            <Link to={this.props.url} >
                <div className={"header-tabs--left__item " + ((this.props.currentHeaderTab === this.props.name) ? "active" : "")}>
                    <div className="header-tabs--left__item__name">
                        {this.props.name}
                    </div>
                </div>
            </Link>
        );
    }
}

HeaderTab.propTypes = {
    "name": PropTypes.string.isRequired,
    "url": PropTypes.string.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired
};
