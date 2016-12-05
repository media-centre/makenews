/* eslint react/jsx-no-literals:0 brace-style:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SCAN_NEWS, WRITE_A_STORY, CONFIGURE, setCurrentHeaderTab } from "./../HeaderActions";
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
        return (
            <div className="header-tabs">
                <nav className="header-tabs--left">
                    <a onClick={() => this.props.dispatch(setCurrentHeaderTab(SCAN_NEWS))}
                        className={this.props.currentHeaderTab === SCAN_NEWS ? "header-tabs--left__item active" : "header-tabs--left__item"}>
                        <span className="header-tabs--left__item__name">Scan News</span>
                    </a>
                    <a onClick={() => this.props.dispatch(setCurrentHeaderTab(WRITE_A_STORY))}
                        className={this.props.currentHeaderTab === WRITE_A_STORY ? "header-tabs--left__item active" : "header-tabs--left__item"}>
                        <span className="header-tabs--left__item__name">Write a Story</span>
                    </a>
                </nav>

                <nav className="header-tabs--right">
                    <a onClick={() => this.props.dispatch(setCurrentHeaderTab(CONFIGURE))}
                        className={this.props.currentHeaderTab === CONFIGURE ? "header-tabs--right__item active" : "header-tabs--right__item"}>
                        <span className="header-tabs--right__item__image">
                            <img src="../../../images/configure-icon.png"/>
                        </span>
                    </a>
                    <div className="user-profile" onClick={() => { this._toggleDropdown(); }} onMouseLeave={() => { this._toggleDropdown(); }}>
                        <span className="user-profile__image">
                            <img src="../../../images/userprofile-icon.png"/>
                        </span>
                        <span className="user-profile__name">User Profile</span>
                        <span>
                            <i className="fa fa-caret-down down-arrow" aria-hidden="true"/>
                        </span>
                        <div className={this.state.show ? "user-profile--dropdown" : "user-profile--dropdown hide"}>
                            <UserProfile />
                        </div>
                    </div>
                </nav>
            </div>
        );
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
