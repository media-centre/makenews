"use strict";
import React, { Component, PropTypes } from "react";

export default class TabControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex || 0
        };
    }

    render() {
        var self = this;
        function classes(index) {
            return this.state.activeIndex === index ? "tab active selected h-center" : "tab h-center";
        }
        console.log(this.props);
        return (
            <div className="tab-control">
                <ul className="tab-header h-center t-center">
                    {this.props.children.map((tab, index) =>
                            <li key={index} className={classes.call(this, index)} onClick={this._handleClick.bind(this, index)}>
                                <i className={"fa fa-" + tab.props.content.name.toLowerCase()}></i>
                                <span>{tab.props.content.name + "(" + tab.props.content.details.length + ")"}</span>
                            </li>
                    )}
                </ul>

                <div className="tab-content">
                    {this.props.children.map(function(content, index) {
                        if(self.state.activeIndex === index) {
                            return <div key={index} className="tab-content-inner">{self.props.children[index]}</div>;
                        }
                    })}
                </div>

            </div>
        );
    }

    _handleClick(index) {
        this.setState({ activeIndex: index });
    }
}

TabControl.displayName = "Tab Control";
TabControl.propTypes = {
    activeIndex: Number
};

