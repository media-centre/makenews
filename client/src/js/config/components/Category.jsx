"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "./TabControl/TabControl.jsx";
import TabContent from "./TabControl/TabContent.jsx";
import { populateCategoryDetailsAsync } from "../actions/CategoryActions.js";
import { connect } from "react-redux";

export default class Category extends Component {
    componentDidMount() {
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryName));
    }

    render() {
        return (
          <div className="category-page max-width">
              <CategoryNavigationHeader />

              <TabControl>
                  {this.props.sources.map((item, index) =>
                      <TabContent key={index} content={item} title={item.name} categoryName={this.props.categoryName} dispatch={this.props.dispatch}/>
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


