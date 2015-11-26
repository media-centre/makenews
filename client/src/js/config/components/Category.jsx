"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "./TabControl/TabControl.jsx";
import TabContent from "./TabControl/TabContent.jsx";
import { populateCategoryDetailsAsync, DEFAULT_CATEGORY, updateCategoryName } from "../actions/CategoryActions.js";
import { connect } from "react-redux";

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "isDefaultCategory": this.props.params.categoryName === DEFAULT_CATEGORY,
            "titleErrorMessage": ""
        };
    }

    componentWillMount() {
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryId));
    }

    _updateCategoryName(categoryName) {
        if(categoryName) {
            this.props.dispatch(updateCategoryName(this.props.params.categoryId, categoryName, (response)=>  {
                this.setState({ titleErrorMessage: response.result ? "Category name already exists" : "" });
                console.log("this.props.params.categoryName", this.props.params.categoryName)
            }));
        } else {
            this.setState({ titleErrorMessage: "Category name can not be empty" });
        }
    }

    render() {
        return (
          <div className="category-page max-width">
              <CategoryNavigationHeader categoryName={this.props.params.categoryName} isDefault={this.state.isDefaultCategory} updateCategoryName={this._updateCategoryName.bind(this)} errorMessage={this.state.titleErrorMessage}/>

              <TabControl>
                  {Object.keys(this.props.sources).map((key, index) =>
                      <TabContent key={index} content={this.props.sources[key].details} title={this.props.sources[key].name} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch}/>
                  )}
              </TabControl>

          </div>
      );
    }
}


Category.displayName = "Category";
Category.propTypes = {
    "categories": PropTypes.node,
    "dispatch": PropTypes.func.isRequired,
    "sources": PropTypes.object.isRequired,
    "params": PropTypes.object,
    "params.categoryType": PropTypes.string
};

function select(store) {
    return store.categoryDetails;
}
export default connect(select)(Category);


