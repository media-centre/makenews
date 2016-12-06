import React, { Component, PropTypes } from "react";
import HeaderTab from "./HeaderTab";
import { setCurrentHeaderTab } from "./../HeaderActions";
import { connect } from "react-redux";

export class Header extends Component {
    render() {
        return(
            <div>
                <HeaderTab url="/newsBoard" name={this.props.mainHeaderStrings.newsBoard.Name} currentHeader={this.props.dispatch(setCurrentHeaderTab("Scan News"))}
                    class={this.props.currentHeaderTab === this.currentHeader ? "header-tabs--left__item active" : "header-tabs--left__item"}
                />
                <HeaderTab url="/storyBoard" name={this.props.mainHeaderStrings.storyBoard.Name} class ={""}/>
            </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentHeaderTab": state.currentHeaderTab
    };
}

Header.propTypes = {
    "mainHeaderStrings": PropTypes.object.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(Header);
