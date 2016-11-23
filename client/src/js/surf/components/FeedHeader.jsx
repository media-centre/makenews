import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";

export default class FeedHeader extends Component {
    render() {
        let localDateTime = this.props.postedDate ? DateTimeUtil.getLocalTimeFromUTC(this.props.postedDate) : null;
        let tags = this.props.tags && this.props.tags.length > 0 ? this.props.tags.map((tag, index) => { //eslint-disable-line consistent-return,no-magic-numbers
            if(tag !== "") { //eslint-disable-line brace-style
                return <li className="tag" key={index}>{tag}</li>;
            } }) : null;
        let categoryNames = this.props.categoryNames && this.props.categoryNames.length > 0 ? this.props.categoryNames.map((categoryname, index) => {  //eslint-disable-line consistent-return,no-magic-numbers
            if(categoryname !== "") { //eslint-disable-line brace-style
                return <li className="tag" key={index}>{categoryname}</li>;
            } }) : null;
        let actionElement = this.props.actionComponent ? React.createElement(this.props.actionComponent, this.props) : null;
        return (
            <div className="feed-header border-bottom box h-center clear-fix">
                <span className="icon-container header-item"><i className={"feed-icon fa fa-" + this.props.feedType.toLowerCase()} /></span>
                <ul className="h-center category-name header-item">{categoryNames}</ul>
                <ul className="h-center header-item">
                    <li className="tag date">{localDateTime} </li>
                    {tags}
                </ul>
                {actionElement}
            </div>
        );
    }
}

FeedHeader.displayName = "FeedHeader";

FeedHeader.propTypes = {
    "actionComponent": PropTypes.func,
    "feedType": PropTypes.string,
    "categoryNames": PropTypes.array,
    "tags": PropTypes.array,
    "postedDate": PropTypes.string,
    "feedAction": PropTypes.func
};
