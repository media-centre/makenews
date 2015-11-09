"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "../TabControl/TabControl.jsx";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "feeds": {
                "rss": ["http://www.demoxyz.com", "http://www.demoxyz123.com", "http://www.demoxyz456.com"],
                "facebook": ["http://www.facebook.com", "http://www.facebook123.com", "http://www.facebook456.com"],
                "twitter": ["http://www.twitter.com", "http://www.twitter123.com", "http://www.twitter456.com"]
            }
        };
    }

    _onUrlChange(event) {}

    render() {
      return (
          <div className="category-page max-width">
              <CategoryNavigationHeader />

              <TabControl>
                      <div display="RSS(3)" icon="fa fa-rss">
                          <div>
                              <div className="nav-control h-center">
                                  <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                              </div>
                              <div className="url-panel">
                                  <ul classaName="url-list">
                                    {this.state.feeds.rss.map((url, index) =>
                                        <li key={index} className="feed-url">
                                            <input type="text" value={url} onChange="this._onUrlChange"/>
                                            <i className="border-blue circle fa fa-close close circle"></i>
                                        </li>
                                    )}
                                  </ul>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                              </div>
                          </div>
                      </div>
                      <div display="Facebook(0)" icon="fa fa-facebook">
                          <div>
                              <div className="nav-control h-center">
                                  <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                              </div>
                              <div className="url-panel">
                                  <ul classaName="url-list">
                                    {this.state.feeds.facebook.map((url, index) =>
                                            <li key={index} className="feed-url">
                                                <input type="text" value={url} onChange="this._onUrlChange"/>
                                                <i className="border-blue circle fa fa-close close circle"></i>
                                            </li>
                                    )}
                                  </ul>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                              </div>
                          </div>
                      </div>
                      <div display="twitter" icon="fa fa-twitter">
                          <div>
                              <div className="nav-control h-center">
                                  <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                              </div>
                              <div className="url-panel">
                                  <ul classaName="url-list">
                                    {this.state.feeds.twitter.map((url, index) =>
                                            <li key={index} className="feed-url">
                                                <input type="text" value={url} onChange="this._onUrlChange"/>
                                                <i className="border-blue circle fa fa-close close circle"></i>
                                            </li>
                                    )}
                                  </ul>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                                  <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange="this._onUrlChange"/>
                              </div>
                          </div>
                      </div>
              </TabControl>

          </div>
      );
    }

}


Category.displayName = "Category";


