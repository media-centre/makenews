"use strict";
import React, { Component, PropTypes } from "react";

export default class TabContent extends Component {

    _onUrlChange() {}

    render() {
        return (
            <div>
                <div className="nav-control h-center">
                    <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                </div>
                <div className="url-panel">
                    <ul classaName="url-list">
                                {this.props.content.urls.map((item, index) =>
                                        <li key={index} className="feed-url">
                                            <input type="text" value={item.url} onChange={this._onUrlChange} />
                                            <i className="border-blue circle fa fa-close close circle"></i>
                                        </li>
                                )}
                    </ul>
                    <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange={this._onUrlChange}/>
                    <input type="text" className="add-url-input box border-blue" placeholder="Enter url here" onChange={this._onUrlChange}/>
                </div>
            </div>
        );
    }
}

TabContent.displayName = "Tab Control";

