import React, { Component, PropTypes } from "react";
import HeaderTab from "./HeaderTab";
import ConfigureTab from "./ConfigureTab";
import UserProfileTab from "./UserProfileTab";

export default class Header extends Component {
    render() {
        return(
            <div>
                <HeaderTab url="/newsBoard" name={this.props.mainHeaderStrings.newsBoard.Name} currentHeaderTab={this.props.currentHeaderTab}/>
                <HeaderTab url="/storyBoard/newStory" name={this.props.mainHeaderStrings.storyBoard.Name} currentHeaderTab={this.props.currentHeaderTab}/>
                <div className = "header-tabs-right">
                    <ConfigureTab url="/configure/web" name={this.props.mainHeaderStrings.configure.Name} currentHeaderTab={this.props.currentHeaderTab}/>
                    <UserProfileTab/>
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    "mainHeaderStrings": PropTypes.object.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired
};
