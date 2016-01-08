/* eslint max-len:0  react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import { populateCategoryDetailsAsync, DEFAULT_CATEGORY, updateCategoryName } from "../actions/CategoryActions.js";
import CategoryDb from "../../config/db/CategoryDb.js";
import { connect } from "react-redux";
import TabComponent from "../../utils/components/TabComponent/TabComponent.jsx";
import RSSComponent from "./RSSComponent.jsx";
import FacebookComponent from "./FacebookComponent.jsx";
import TwitterComponent from "./TwitterComponent.jsx";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";

const RSS = "rss";
const FACEBOOK = "facebook";
const TWITTER = "twitter";

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "isDefaultCategory": this.props.params.categoryName === DEFAULT_CATEGORY,
            "titleErrorMessage": "",
            "isValidName": true,
            "categoryName": this.props.params.categoryName
        };
    }

    componentWillMount() {
        this.props.dispatch(highLightTabAction(["Configure", "RSS"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryId));
        const pageReload = "POP";
        if(this.props.location.action === pageReload) { //eslint-disable-line react/prop-types
            CategoryDb.fetchCategoryById(this.props.params.categoryId).then((response) => {
                this.setCategoryName(response[0].name);
            });
        }
        window.scrollTo(0, 0);
    }

    setCategoryName(categoryName) {
        this.setState({
            "isDefaultCategory": this.state.isDefaultCategory,
            "titleErrorMessage": this.state.titleErrorMessage,
            "isValidName": this.state.isValidName,
            "categoryName": categoryName
        });
    }

    _isValidName(categoryName) {
        return categoryName.match(/^[ A-Za-z0-9_-]*$/) !== null;
    }

    _updateCategoryName(categoryName) {
        if(!categoryName) {
            this.setState({ "titleErrorMessage": "Category name can not be empty", "isValidName": false });
            return;
        }


        if(this._isValidName(categoryName)) {
            this.props.dispatch(updateCategoryName(categoryName, this.props.params.categoryId, (response)=> {
                if(response.status) {
                    this.setState({ "titleErrorMessage": "Category name is updated", "isValidName": true, "categoryName": categoryName });
                } else {
                    this.setState({ "titleErrorMessage": "Category name already exists", "isValidName": false, "categoryName": this.state.categoryName });
                }
            }));
        } else {
            this.setState({ "titleErrorMessage": "Invalid category name. Use only - or _", "isValidName": false, "categoryName": this.state.categoryName });
        }
    }

    _getValidURLCount(content) {
        let items = content.filter((item) => {
            if(item.status === "valid") {
                return item;
            }
        });
        return items.length;
    }

    render() {

        let tabContent = Object.keys(this.props.categoryDetails.sources).map((key, index) => {
            let item = this.props.categoryDetails.sources[key];
            if(key === RSS) {
                return <RSSComponent key={index} name={item.name} tab-header={item.name + "(" + this._getValidURLCount(item.details) + ")"} icon={key} content={item.details} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings}/>;
            } else if(key === FACEBOOK) {
                return <FacebookComponent key={index} name={item.name} tab-header={item.name + "(" + this._getValidURLCount(item.details) + ")"} icon={key} content={item.details} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings}/>;
            } else if(key === TWITTER) {
                return <TwitterComponent key={index} name={item.name} tab-header={item.name + "(" + this._getValidURLCount(item.details) + ")"} icon={key} content={item.details} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings}/>;
            }
        });
        let categoryName = this.state.categoryName;
        return (
          <div className="category-page max-width">
              <CategoryNavigationHeader isValidName={this.state.isValidName} categoryName={categoryName} categoryId={this.props.params.categoryId} isDefault={this.state.isDefaultCategory} updateCategoryName={this._updateCategoryName.bind(this)} errorMessage={this.state.titleErrorMessage} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings}/>
              <TabComponent tabToHighlight={this.props.highlightedTab} dispatch={this.props.dispatch}>{tabContent}</TabComponent>
          </div>
      );
    }
}


Category.displayName = "Category";
Category.propTypes = {
    "categoryDetails": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "params": PropTypes.object,
    "highlightedTab": PropTypes.object,
    "params.categoryType": PropTypes.string,
    "categoryDetailsPageStrings": PropTypes.object.isRequired
};

function select(store) {
    return { "categoryDetails": store.categoryDetails, "categoryDetailsPageStrings": store.configurePageLocale.categoryDetailsPage, "highlightedTab": store.highlightedTab };
}
export default connect(select)(Category);
