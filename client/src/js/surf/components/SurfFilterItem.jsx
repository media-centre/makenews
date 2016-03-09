/*eslint no-nested-ternary:0, max-len:0, brace-style:0 */
"use strict";
import React, { Component, PropTypes } from "react";

export default class SurfFilterItem extends Component {

    _highlightFilter(item) {
        let className = this.props.type === "text" ? "item surf-image category" : "item surf-image";
        this.props.filterItems.forEach((filterItem)=> {
            if(filterItem._id === item._id) {
                className += " selected";
            }
        });
        return className;
    }

    filterItem(item) {
        let NOT_FOUND = -1;
        let index = this.getItemIndex(item);
        let filterItems = this.props.filterItems;
        if(index === NOT_FOUND) {
            filterItems.push(item);
        } else {
            filterItems.splice(index, 1);
        }
        window.scrollTo(0, 0);
        this.props.dispatchFilterAction(this.props.type, filterItems);
    }

    getItemIndex(item) {
        let itemIndex = -1;
        this.props.filterItems.forEach((filterItem, index)=> {
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
            <div className={"surf-filter-item " + this.props.className}>
                <h4 className="box">{this.props.title}</h4>
                <ul className="box h-center">{displayItems}</ul>
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
    "className": PropTypes.string.isRequired,
    "dispatchFilterAction": PropTypes.func.isRequired
};

SurfFilterItem.defaultProps = {
};
