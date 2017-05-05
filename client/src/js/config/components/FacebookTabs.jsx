/* eslint react/jsx-no-literals:0, brace-style:0 react/jsx-closing-bracket-location:0*/
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PAGES, GROUPS } from "../actions/FacebookConfigureActions";
import * as sourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import { Link } from "react-router";

export class FacebookTabs extends PureComponent {
    constructor() {
        super();
        this._tabHandler = this._tabHandler.bind(this);
    }

    _tabHandler(event) {
        this.props.dispatch(sourceConfigActions.switchSourceTab(event.target.dataset.tab));
    }

    _renderTab(tab, tabName) {
        return (
            <Link to={`/configure/facebook/${tabName.toLowerCase()}`} data-tab={tab} onClick={this._tabHandler}
                className={this.props.currentTab === tab ? "fb-sources-tab__item active" : "fb-sources-tab__item"} >
                { tabName }
            </Link>
        );
    }

    render() {
        return (
            <nav className="fb-sources-tab">
                { this._renderTab(PAGES, "Pages") }
                { this._renderTab(GROUPS, "Groups") }
            </nav>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.currentSourceTab
    };
}

FacebookTabs.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(FacebookTabs);
