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

        var self = this;
        function classes(index) {
            return this.state.activeIndex === index ? "tab active selected h-center" : "tab h-center";
        }

        let tabHeader = this.props.children.map((tab, index) =>
                <li key={index} className={classes.call(this, index)} onClick={this._handleClick.bind(this, index)}>
                    <i className={"fa fa-" + tab.props.title.toLowerCase()}></i>
                    <span>{tab.props.title + "(" + tab.props.content.details.length + ")"}</span>
                </li>
        );

        let tabContent = this.props.children.map(function(content, index) {
            if(self.state.activeIndex === index) {
                return <div key={index} className="tab-content-inner">{self.props.children[index]}</div>;
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

