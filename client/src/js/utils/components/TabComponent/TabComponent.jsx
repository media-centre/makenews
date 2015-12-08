"use strict";
import React, { Component, PropTypes } from "react";

export default class TabComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeIndex": this.props.activeIndex || 0
        };
    }

    _selectTab(index) {
        if(this.state.activeIndex === index) {
            return;
        }
        this.setState({ "activeIndex": index });
    }

    render() {

        let headers = this.props.children.map((header, index)=> {
            let li = null;
            if(header.props.icon) {
                li = (<li key={index} className={index === this.state.activeIndex ? "tab h-center active selected" : "tab h-center"} ref={"tab" + index} onClick={this._selectTab.bind(this, index)}>
                    <i className={"fa fa-" + header.props.icon.toLowerCase()}></i>
                    <span>{header.props["tab-header"]}</span>
                </li>);
            } else {
                li = <li key={index} className={index === this.state.activeIndex ? "tab h-center active selected" : "tab h-center"} ref={"tab" + index} onClick={this._selectTab.bind(this, index)}>{header.props["tab-header"]}</li>;
            }
            return li;
        });


        return (
            <div className="tab-control" ref="tabControl">
                <ul className="tab-header h-center t-center">
                    {headers}
                </ul>

                <div className="tab-content" ref="tabContent">
                    <div className="tab-content-inner">{this.props.children[this.state.activeIndex]}</div>
                </div>
            </div>
        );
    }
}

TabComponent.displayName = "TabComponent";

TabComponent.propTypes = {
    "children": PropTypes.node.isRequired,
    "tab-header": PropTypes.string.isRequired,
    "activeIndex": PropTypes.number
};
