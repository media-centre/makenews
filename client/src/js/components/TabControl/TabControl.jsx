"use strict";
import React, { Component, PropTypes } from "react";

export default class TabPanel extends Component {
    render() {
        var active = this.props.active || false;
        if (active) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default class TabControl extends Component {

    getInitialState() {
        return {
            activeIndex: this.props.activeIndex || 0
        }
    }

    render() {

        var self = this;
        var cx = React.addons.classSet;
        var tabHeader = this.props.children.map(function (tab, index) {
            var className = cx({'active': self.state.activeIndex === index});
            return (
                <li onClick={self._handleClick.bind(null, index)}><a className={className} href="#">{tab.props.display}</a></li>
            );
        });

        var tabContent = this.props.children.map(function (content, index) {
            if(self.state.activeIndex === index) {
                return (
                    <div className="TabPane">{content.props.children}</div>
                );
            }
        });

        return (
            <div className="tab-control">
                <ul className="tab-header">{tabHeader}</ul>
                <section className="tab-content">{tabContent}</section>
            </div>
        );
    }

    _handleClick(index) {
        this.setState({
            activeIndex: index
        });
    }
}


TabPanel.displayName = "Tab Panel";
TabPanel.propTypes = {

};

TabControl.displayName = "Tab Control";
TabControl.propTypes = {

};
