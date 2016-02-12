/*eslint no-nested-ternary:0, max-len:0, brace-style:0 */
"use strict";
import React, { Component, PropTypes } from "react";

export default class SourceTypeFilter extends Component {

    constructor(props) {
        super(props);

        let displayItems = [
            {
                "name": "All",
                "_id": "all"
            },
            {
                "name": "Rss",
                "_id": "rss"
            },
            {
                "name": "Facebook",
                "_id": "facebook"
            },
            {
                "name": "Twitter",
                "_id": "twitter"
            }
        ];
        this.state = { "displayItems": displayItems };
    }

    _highlightFilter(item) {
        let className = "item";
        if(this.props.filter.sourceTypes) {
            this.props.filter.sourceTypes.forEach((filterItem)=> {
                if(filterItem._id === item._id) {
                    className += " selected";
                }
            });
        }
        return className;
    }

    filterItem(item) {
        let NOT_FOUND = -1;
        let index = this.getItemIndex(item);
        let filter = this.props.filter;
        if(index === NOT_FOUND) {
            filter.sourceTypes.push(item);
        } else {
            filter.sourceTypes.splice(index, 1);
        }
        this.props.dispatchFilterAction(filter);
    }

    getItemIndex(item) {
        let itemIndex = -1;
        this.props.filter.sourceTypes.forEach((filterItem, index)=> {
            if(filterItem._id === item._id) {
                itemIndex = index;
            }
        });
        return itemIndex;
    }

    render() {
        let displayItems = this.state.displayItems.map((item, index)=> {
            return <li className={this._highlightFilter(item)} key={index} onClick={this.filterItem.bind(this, item)}>{item.name}</li>;
        });
        return (
            <div className="source-type-filter">
                <ul className="source-type-list max-width">
                    {displayItems}
                </ul>
            </div>
        );
    }
}

SourceTypeFilter.displayName = "SourceTypeFilter";

SourceTypeFilter.propTypes = {
    "filter": PropTypes.object.isRequired,
    "dispatchFilterAction": PropTypes.func.isRequired
};

SourceTypeFilter.defaultProps = {
};
