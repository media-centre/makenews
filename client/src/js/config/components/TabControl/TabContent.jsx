/* eslint no-underscore-dangle:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addRssUrlAsync } from "../../actions/CategoryActions.js";

let urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i

export default class TabContent extends Component {

    constructor(props) {
        super(props);

        this.state = {showTextbox: false, error: false};
    }

    _onUrlChange() {}

    _addNewUrlButton() {
        let self = this, renderingTime = 100;

        self.setState({showTextbox: true});
        setTimeout(function() { self.refs.addUrlTextBox.focus(); }, renderingTime);
    }

    _onKeyDownTextBox(event, props) {
        console.log("in on key down text box");
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            let url = this.refs.addUrlTextBox.value.trim();
            if(this._isInvalidUrl(url)) {
                this.setState({error: true});
            } else {
                props.dispatch(addRssUrlAsync(props.categoryId, url));
                this.refs.addUrlTextBox.value = "";
                this.setState({showTextbox: false});
            }
        }
    }

    _isInvalidUrl(url) {
        return false;
        //return (this.props.content.indexOf(url) !== -1 || url.match(urlRegex) === null);
    }

    render() {

        let inputBox = this.state.showTextbox ? <input type="text" ref="addUrlTextBox" className={this.state.error ? "add-url-input box error-border" : "add-url-input box"} placeholder="Enter url here" onKeyDown={(event) => this._onKeyDownTextBox(event, this.props)}/> : null;

        return (
            <div>
                <div className="nav-control h-center" onClick={(event) => this._addNewUrlButton()}>
                    <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                </div>
                <div className="url-panel">
                    <ul classaName="url-list">
                                {this.props.content.map((urlObj, index) =>
                                        <li key={index} className="feed-url">
                                            <input type="text" value={urlObj.url} onChange={this._onUrlChange} />
                                            <i className="border-blue circle fa fa-close close circle"></i>
                                        </li>
                                )}
                    </ul>
                {inputBox}
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

