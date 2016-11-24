/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { PROFILES, PAGES, GROUPS, facebookSourceTabSwitch } from "../actions/FacebookConfigureActions";

export class FacebookTabs extends Component {
    render() {
        return (
            <nav className="fb-sources-tab">
                <a onClick={() => this.props.dispatch(facebookSourceTabSwitch(PROFILES))} className={this.props.currentTab === PROFILES ? "fb-sources-tab__item active" : "fb-sources-tab__item"}>
                    Profiles
                </a>
                <a onClick={() => this.props.dispatch(facebookSourceTabSwitch(PAGES))} className={this.props.currentTab === PAGES ? "fb-sources-tab__item active" : "fb-sources-tab__item"}>
                    Pages
                </a>
                <a onClick={() => this.props.dispatch(facebookSourceTabSwitch(GROUPS))} className={this.props.currentTab === GROUPS ? "fb-sources-tab__item active" : "fb-sources-tab__item"}>
                    Groups
                </a>
            </nav>
        );
    }
}

function mapToStore(store) {
    return {
        "currentTab": store.facebookCurrentSourceTab
    };
}

FacebookTabs.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(FacebookTabs);
