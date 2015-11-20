"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "./TabControl/TabControl.jsx";
import TabContent from "./TabControl/TabContent.jsx";
import { populateCategoryDetailsAsync } from "../actions/CategoryActions.js";
import { connect } from "react-redux";

export default class Category extends Component {
    componentDidMount() {
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryId));
    }

    render() {
        return (
          <div className="category-page max-width">
              <CategoryNavigationHeader title={this.props.params.categoryName} />

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
    "sources": PropTypes.array.isRequired,
    "categoryName": PropTypes.string.isRequired,
    "params": PropTypes.object,
    "params.categoryType": PropTypes.string
};

function select(store) {
    return store.categoryDetails;
}
export default connect(select)(Category);


