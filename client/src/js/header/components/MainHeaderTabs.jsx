/* eslint react/jsx-no-literals:0 brace-style:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SCAN_NEWS, WRITE_A_STORY, CONFIGURE, getCurrentHeaderTab } from "./../HeaderActions";
import UserProfile from "./../components/UserProfile";

export class MainHeaderTabs extends Component {

    constructor(props) {
        super(props);
        this.state = { "show": false };
    }

    _toggleDropdown() {
        this.setState({ "show": !this.state.show });
    }

    render() {
        return (<div className="header-tabs">
            <nav className="header-tabs__left">
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(SCAN_NEWS))} className={this.props.currentHeaderTab === SCAN_NEWS ? "header-tabs__left__scannews active" : "header-tabs__left__scannews"}>
                    <span className="header-tabs__left__scannews__name" >Scan News</span>
                </a>
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(WRITE_A_STORY))} className={this.props.currentHeaderTab === WRITE_A_STORY ? "header-tabs__left__writeastory active" : "header-tabs__left__writeastory"}>
                    <span className="header-tabs__left__writeastory__name">Write a Story</span>
                </a>
            </nav>

            <nav className="header-tabs__right">
                <a onClick={() => this.props.dispatch(getCurrentHeaderTab(CONFIGURE))} className={this.props.currentHeaderTab === CONFIGURE ? "header-tabs__right__configure active" : "header-tabs__right__configure"}>
                    <span className="header-tabs__right__configure__image">
                        <img src="../../../images/configure-icon.png"/>
                    </span>
                </a>
                <a className="header-tabs__right__userprofile" onClick={() => { this._toggleDropdown(); }}>
                    <span className="header-tabs__right__userprofile__image">
                        <img src="../../../images/userprofile-icon.png"/>
                    </span>
                    <span className="header-tabs__right__userprofile__name">User Profile</span>
                    <span className="header-tabs__right__userprofile__downarrow">
                        <i className="fa fa-caret-down" aria-hidden="true"/>
                        <div className={this.state.show ? "header-tabs__userprofile" : "header-tabs__userprofile hide"}>
                            <UserProfile />
                        </div>
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
