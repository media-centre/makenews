/* eslint react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";
import { highLightTabAction } from "../../../tabs/TabActions.js";

export default class TabComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeIndex": this.props.activeIndex || 0
        };
    }

    _selectTab(index, tabName) {
        this.props.dispatch(highLightTabAction(["Configure", tabName]));
        if(this.state.activeIndex === index) {
            return;
        }
        this.setState({ "activeIndex": index });
    }

    _activeClassName(tabName) {
        const NOT_FOUND_INDEX = -1;
        return this.props.tabToHighlight.tabNames.indexOf(tabName) === NOT_FOUND_INDEX ? "tab h-center" : "tab h-center active selected";
    }

    render() {
        let headers = this.props.children.map((header, index)=> {
            let li = null;
            let tabDisplayName = header.props["tab-header"];
            let tabName = header.props.name;
            if(header.props.icon) {
                li = (<li key={index} className={this._activeClassName.bind(tabName)} ref={"tab" + index} onClick={this._selectTab.bind(this, index, tabName)}>
                <i className={"fa fa-" + header.props.icon.toLowerCase()}></i>
                    <span>{tabDisplayName}</span>
                </li>);
            } else {
                li = (<li key={index} className={this._activeClassName(tabName)} ref={"tab" + index} onClick={this._selectTab.bind(this, index, tabName)}>
                        {tabDisplayName}
                    </li>);
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
    "activeIndex": PropTypes.number,
    "dispatch": PropTypes.func.isRequired,
    "tabToHighlight": PropTypes.object.isRequired
};
