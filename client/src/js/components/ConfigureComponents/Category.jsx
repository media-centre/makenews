"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "../TabControl/TabControl.jsx";
import TabContent from "../TabControl/TabContent.jsx";

export default class Category extends Component {

    constructor(props) {
        super( props );

        this.state = {
            "feeds": [
                 {
                    "name": "RSS",
                    "urls": [
                        { "url": "http://www.demoxyz.com" },
                        { "url": "http://www.demoxyz123.com" },
                        { "url": "http://www.demoxyz456.com" }
                    ]
                },
                {
                    "name": "Facebook",
                    "urls": [
                        { "url": "http://www.facebook.com" },
                        { "url": "http://www.facebook123.com" },
                        { "url": "http://www.facebook456.com" }
                    ]
                },
                {
                    "name": "Twitter",
                    "urls": [
                        { "url": "http://www.twitter.com" },
                        { "url": "http://www.twitter123.com" },
                        { "url": "http://www.twitter456.com" }
                    ]
                }
            ]
        };
    }

    render() {
      return (
          <div className="category-page max-width">
              <CategoryNavigationHeader />

              <TabControl>
                {this.state.feeds.map((item, index) =>
                    <TabContent key={index} content={item} />
                )}
              </TabControl>

          </div>
      );
    }

}


Category.displayName = "Category";


