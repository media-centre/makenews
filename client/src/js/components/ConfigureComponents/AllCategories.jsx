"use strict";
import React, { Component, PropTypes } from "react";

export default class AllCategories extends Component {

  render() {
      return (
          <div className="configure-page">
              <h4 className="t-center">
                    {"All categories"}
              </h4>
              <div className="categories">
                  <ul className="cat-list m-t-center">
                      <li className="add-new"><div className="v-center t-center">
                            {"Add new category"}
                      </div></li>
                      <li className="category"><div className="v-center t-center">
                            {"Default Category"}
                      </div></li>
                  </ul>
              </div>
          </div>
      );
  }

}


AllCategories.displayName = "All categories";


