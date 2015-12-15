/* eslint no-unused-vars:0*/
"use strict";
import Logo from "../../utils/components/Logo.jsx";
import CustomTabComponent from "../../utils/components/TabComponent/CustomTabComponent.jsx";
import TabGroup from "../../utils/components/TabComponent/TabGroup.jsx";
import Logout from "../../login/components/Logout.jsx";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";

export default class MainHeader extends Component {

    render() {
        return (
            <header>
                <div className="fixed-header clear-fix multi-column">
                    <Logo ref="logo"/>

                    <div className="user-info right" id="logout">
                        <Logout ref="logout" logoutButton={this.props.headerStrings.logoutButton}/>
                    </div>

                    <div className="flexible t-center">
                        <TabGroup highlightedTab={this.props.highlightedTab} >
                            <CustomTabComponent name={this.props.headerStrings.configTab.Name} url="/configure/categories" />
                            <CustomTabComponent name={this.props.headerStrings.surfTab.Name} url="/surf" />
                            <CustomTabComponent name={this.props.headerStrings.parkTab.Name} url="/park" />
                        </TabGroup>
                    </div>
                </div>
            </header>
        );
    }
}

MainHeader.displayName = "Main Header";
MainHeader.propTypes = {
    "headerStrings": PropTypes.object.isRequired,
    "highlightedTab": PropTypes.object.isRequired
};
