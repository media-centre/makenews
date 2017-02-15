import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

export default class ConfigPaneNavigation extends Component {
    render() {
        return (
            <nav className="sources-nav">
                <Link to="/configure/web" className={this.props.currentSourceType === "web" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-globe"/>
                    Web URLs
                </Link>
                <Link to="/configure/facebook/profiles" className={this.props.currentSourceType === "facebook" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-facebook-square"/>Facebook
                </Link>
                <Link to="/configure/twitter" className={this.props.currentSourceType === "twitter" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-twitter"/>Twitter
                </Link>
            </nav>
        );
    }
}

ConfigPaneNavigation.propTypes = {
    "currentSourceType": PropTypes.string
};
