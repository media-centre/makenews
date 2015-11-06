"use strict";
import React, { Component, PropTypes } from "react";
import {Route, Link} from "react-router";

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
                          <Link to="/configure/category"><span>{"Default Category"}</span></Link>
                      </div></li>
                  </ul>
              </div>
          </div>
      );
  }

}


AllCategories.displayName = "All categories";


