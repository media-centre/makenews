/*eslint no-nested-ternary:0, max-len:0, brace-style:0 */
"use strict";
import React, { Component, PropTypes } from "react";

export default class SurfFilterItem extends Component {

    constructor(props) {
        super(props);
        this.state = { "filterItems": this.props.filterItems };
    }

    getFilteredFeeds(item, props) {

    }

    _highlightFilter(item) {
        let className = this.props.type === "text" ? "item surf-image category" : "item surf-image";
        this.state.filterItems.forEach((filterItem)=> {
            if(filterItem._id === item._id) {
                className += " selected";
            }
        });
        return className;
    }

    filterItem(item) {
        let NOT_FOUND = -1;
        let index = this.getItemIndex(item);
        if(index === NOT_FOUND) {
            this.state.filterItems.push(item);
        } else {
            this.state.filterItems.splice(index, 1);
        }

        this.props.dispatchFilterAction(this.props.type, this.state.filterItems);
    }

    getItemIndex(item) {
        let itemIndex = -1;
        this.state.filterItems.forEach((filterItem, index)=> {
            if(filterItem._id === item._id) {
                itemIndex = index;
            }
        });
        return itemIndex;
    }

    render() {
        let displayItems = this.props.displayItems.map((item, index)=> {
            let li = null;
            if(this.props.type === "text") {
                li = <li className={this._highlightFilter(item)} key={index} onClick={this.filterItem.bind(this, item)}>{item.name}</li>;
            } else {
                li = (<li key={index} className={this._highlightFilter(item)} onClick={this.filterItem.bind(this, item)}>
                        <div className={"image fa fa-" + item.image}></div><div className="content-type">{item.name}</div>
                    </li>);
            }
            return li;
        });
        return (
            <div className="surf-filter-item max-width clear-fix">
                <label className="left box">{this.props.title}</label>
                <ul className="left box h-center">{displayItems}</ul>
            </div>
        );
    }
}

SurfFilterItem.displayName = "SurfFilter";

SurfFilterItem.propTypes = {
    "type": PropTypes.string.isRequired,
    "displayItems": PropTypes.array.isRequired,
    "filterItems": PropTypes.array.isRequired,
    "title": PropTypes.string.isRequired,
    "dispatchFilterAction": PropTypes.func.isRequired
};

SurfFilterItem.defaultProps = {
};
