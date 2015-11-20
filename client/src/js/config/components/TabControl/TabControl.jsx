/* eslint no-underscore-dangle:0 */
"use strict";
import React, { Component, PropTypes } from "react";

export default class TabControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex || 0
        };
    }

    _handleClick(index) {
        this.setState({ activeIndex: index });
    }

    render() {

        let self = this, tabHeader = null, tabContent = null;
        let tabContentDom = this.props.children instanceof Array ? this.props.children : [this.props.children];

        function classes(index) {
            return this.state.activeIndex === index ? "tab active selected h-center" : "tab h-center";
        }

        tabHeader = tabContentDom.map((tab, index) =>
                <li key={index} ref={'tab' + index} className={classes.call(this, index)} onClick={this._handleClick.bind(this, index)}>
                    <i className={"fa fa-" + tab.props.title.toLowerCase()}></i>
                    <span>{tab.props.title + "(" + tab.props.content.length + ")"}</span>
                </li>
        );

        tabContent = tabContentDom.map(function(content, index) {
            if(self.state.activeIndex === index) {
                return <div key={index} ref={'tabContent' + index} data-selected={self.state.activeIndex} className="tab-content-inner">{self.props.children[index]}</div>;
            }
        });

        return (
            <div className="tab-control">

                <ul className="tab-header h-center t-center">{tabHeader}</ul>
                <div className="tab-content">{tabContent}</div>

            </div>
        );
    }

}

TabControl.displayName = "Tab Control";
TabControl.propTypes = {
    "activeIndex": PropTypes.number,
    "children": PropTypes.node.isRequired
};

