/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SCAN_NEWS, WRITE_A_STORY, CONFIGURE, USER_PROFILE, getCurrentHeaderTab } from "./../HeaderActions";

export class MainHeaderTabs extends Component {
    render() {
        return (<div className="main-header-sources">
            <nav className="main-header-left-sources">
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(SCAN_NEWS))} className={this.props.currentHeaderTab === SCAN_NEWS ? "main-header-left-sources__scannews active" : "main-header-left-sources__scannews"}>
                    <span className="main-header-left-sources__scannews__name" >Scan News</span>
                </a>
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(WRITE_A_STORY))} className={this.props.currentHeaderTab === WRITE_A_STORY ? "main-header-left-sources__writeastory active" : "main-header-left-sources__writeastory"}>
                    <span className="main-header-left-sources__writeastory__name">Write a Story</span>
                </a>
            </nav>

            <nav className="main-header-right-sources">
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(CONFIGURE))} className={this.props.currentHeaderTab === CONFIGURE ? "main-header-right-sources__configure active" : "main-header-right-sources__configure"}>
                    <span className="main-header-right-sources__configure__image">
                        <img src="../../../images/configure-icon.png"/>
                    </span>
                </a>
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(USER_PROFILE))} className={this.props.currentHeaderTab === USER_PROFILE ? "main-header-right-sources__userprofile active" : "main-header-right-sources__userprofile"}>
                    <span className="main-header-right-sources__userprofile__image">
                        <img src="../../../images/userprofile-icon.png"/>
                    </span>
                    <span className="main-header-right-sources__userprofile__name">User Profile</span>
                    <span className="main-header-right-sources__userprofile__down">
                        <i className="fa fa-caret-down" aria-hidden="true"/>
                    </span>
                </a>
            </nav>
        </div>);
    }
}

function mapToStore(state) {
    return {
        "currentHeaderTab": state.currentHeaderTab
    };
}

MainHeaderTabs.propTypes = {
    "currentHeaderTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(MainHeaderTabs);
