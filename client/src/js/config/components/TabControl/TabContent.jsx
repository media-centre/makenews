/* eslint no-underscore-dangle:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addRssUrlAsync } from "../../actions/CategoryActions.js";

export default class TabContent extends Component {

    _onUrlChange() {
    }

    onKeyDownTextBox1(event, props) {
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            props.dispatch(addRssUrlAsync(props.categoryName, this.refs.addUrlTextBox1.value.trim()));
        }
    }

    onKeyDownTextBox2(event, props) {
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            props.dispatch(addRssUrlAsync(props.categoryName, this.refs.addUrlTextBox2.value.trim()));
        }
    }

    render() {
        return (
            <div>
                <div className="nav-control h-center">
                    <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                </div>
                <div className="url-panel">
                    <ul classaName="url-list">
                                {this.props.content.details.map((url, index) =>
                                        <li key={index} className="feed-url">
                                            <input type="text" value={url} onChange={this._onUrlChange} />
                                            <i className="border-blue circle fa fa-close close circle"></i>
                                        </li>
                                )}
                    </ul>
                    <input type="text" ref="addUrlTextBox1" className="add-url-input box border-blue" placeholder="Enter url here" onKeyDown={(event) => this.onKeyDownTextBox1(event, this.props)}/>
                    <input type="text" ref="addUrlTextBox2" className="add-url-input box border-blue" placeholder="Enter url here" onKeyDown={(event) => this.onKeyDownTextBox2(event, this.props)}/>
                </div>
            </div>
        );
    }
}

TabContent.displayName = "Tab Control";
TabContent.propTypes = {
    "content": PropTypes.object.isRequired,
    "content.details": PropTypes.array
};

