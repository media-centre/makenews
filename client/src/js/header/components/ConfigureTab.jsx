import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

export default class ConfigureTab extends PureComponent {
    render() {
        return (
            <Link to={this.props.url} >
                <div className={"header-tabs--configure " + ((this.props.currentHeaderTab === this.props.name) ? "active" : "")}>
                    <span className="header-tabs--configure__image">
                        <img src="./images/configure-icon.png"/>
                    </span>
                </div>
            </Link>
        );
    }
}

ConfigureTab.propTypes = {
    "name": PropTypes.string.isRequired,
    "url": PropTypes.string.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired
};
