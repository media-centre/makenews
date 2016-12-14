/* eslint react/jsx-no-literals:0, brace-style:0 react/jsx-closing-bracket-location:0*/
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as FBActions from "../actions/FacebookConfigureActions";
import { clearSources } from "./../../sourceConfig/actions/SourceConfigurationActions";

export class FacebookTabs extends Component {
    _tabHandler(tab) {
        this.props.dispatch(clearSources());
        this.props.dispatch(FBActions.facebookSourceTabSwitch(tab));
    }

    _renderTab(tab, tabName) {
        return (<a onClick={() => { this._tabHandler(tab); }}
            className={this.props.currentTab === tab ? "fb-sources-tab__item active" : "fb-sources-tab__item"} >
            { tabName }
        </a>);
    }

    render() {
        return (
            <nav className="fb-sources-tab">
                { this._renderTab(FBActions.PROFILES, "Profiles") }
                { this._renderTab(FBActions.PAGES, "Pages") }
                { this._renderTab(FBActions.GROUPS, "Groups") }
            </nav>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.facebookCurrentSourceTab
    };
}

FacebookTabs.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(FacebookTabs);
