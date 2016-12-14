/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";

export class ConfigureURLs extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Configure"));
    }

    render() {
        return (
            <div>
                <nav className="sources-nav">
                    <div className="sources-nav__item">Web</div>
                    <div className="sources-nav__item">Facebook</div>
                    <div className="sources-nav__item">Twitter</div>
                </nav>
                { this.props.children }
            </div>
        );
    }
}

ConfigureURLs.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ConfigureURLs);

