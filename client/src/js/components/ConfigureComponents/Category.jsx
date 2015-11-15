"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "../TabControl/TabControl.jsx";
import TabContent from "../TabControl/TabContent.jsx";
import { connect } from "react-redux";
import { populateCategoryDetailsAsync } from "../../actions/config/CategoryActions.js";


export default class Category extends Component {
    render() {
      return (
          <div className="category-page max-width">
              <CategoryNavigationHeader />

              <TabControl>
                  {this.props.sources.map((item, index) =>
                      <TabContent key={index} content={item} categoryName={this.props.categoryName} dispatch={this.props.dispatch}/>
                  )}
              </TabControl>

          </div>
      );
    }

    componentDidMount() {
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryType));
    }

}


Category.displayName = "Category";

function select(store) {
    return store.categoryDetails;
}
export default connect(select)(Category);


