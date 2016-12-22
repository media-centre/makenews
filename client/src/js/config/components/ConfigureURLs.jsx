/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";
import { Link } from "react-router";

export class ConfigureURLs extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Configure"));
    }

    render() {
        return (
            <div>
                <nav className="sources-nav">
                    <Link to="/configure/web" className={this.props.params.sourceType === "web" ? "sources-nav__item active" : "sources-nav__item"}>Web</Link>
                    <Link to="/configure/facebook/profiles" className={this.props.params.sourceType === "facebook" ? "sources-nav__item active" : "sources-nav__item"}>Facebook</Link>
                    <Link to="/configure/twitter" className={this.props.params.sourceType === "twitter" ? "sources-nav__item active" : "sources-nav__item"}>Twitter</Link>
                </nav>
                { this.props.children }
            </div>
        );
    }
}

ConfigureURLs.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node.isRequired,
    "params": PropTypes.object.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ConfigureURLs);
