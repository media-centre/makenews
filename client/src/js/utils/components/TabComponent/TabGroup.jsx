/* eslint react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";

export default class TabGroup extends Component {
    renderChildren() {
        let _tabToBeHighlighted = this.props.highlightedTab.tabName;
        return React.Children.map(this.props.children, function(child) {
            return React.cloneElement(child, {
                "tabToHighlight": _tabToBeHighlighted
            });
        });
    }

    render() {
        return (
            <ul className="menu-list">
                {this.renderChildren()}
            </ul>
        );
    }
}

TabGroup.displayName = "TabGroup";

TabGroup.propTypes = {
    "children": PropTypes.node
};
