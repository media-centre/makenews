import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import HeaderTab from "./HeaderTab";
import ConfigureTab from "./ConfigureTab";
import UserProfileTab from "./UserProfileTab";
import ConfirmPopup from "./../../utils/components/ConfirmPopup/ConfirmPopup";

export class Header extends Component {
    render() {
        const renderedDOM = this.props.currentHeaderTab === "Configure"
            ? null
            : (<div>
                <HeaderTab url="/newsBoard" name={this.props.mainHeaderStrings.newsBoard}
                    currentHeaderTab={this.props.currentHeaderTab}
                />
                <HeaderTab url="/story-board/stories" name={this.props.mainHeaderStrings.storyBoard}
                    currentHeaderTab={this.props.currentHeaderTab}
                />
                <div className="header-tabs-right">
                    <ConfigureTab url="/configure/web" name={this.props.mainHeaderStrings.configure}
                        currentHeaderTab={this.props.currentHeaderTab}
                    />
                    <UserProfileTab/>
                </div>

                { this.props.confirmPopup.message &&
                <ConfirmPopup
                    description={this.props.confirmPopup.message}
                    callback={this.props.confirmPopup.callback}
                    dispatch={this.props.dispatch}
                    hide={this.props.confirmPopup.hide}
                /> }
            </div>
            );
        return renderedDOM;
    }
}

Header.propTypes = {
    "mainHeaderStrings": PropTypes.object.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired,
    "confirmPopup": PropTypes.object.isRequired,
    "dispatch": PropTypes.func
};

function mapToStore(store) {
    return {
        "confirmPopup": store.popUp
    };
}

export default connect(mapToStore)(Header);
