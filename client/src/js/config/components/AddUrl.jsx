/* eslint brace-style:0, react/jsx-no-literals:0*/
import React, { Component, PropTypes } from "react";
import * as AddUrlActions from "../actions/AddUrlActions";
import { connect } from "react-redux";
import Toast from "../../utils/custom_templates/Toast";

export class AddUrl extends Component {

    constructor() {
        super();
        this.urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; //eslint-disable-line max-len
    }

    _addUrl() {
        let url = this.refs.url.value.trim();
        if (url.match(this.urlRegex)) {
            this.props.dispatch(AddUrlActions.addRssUrl(url));
        } else {
            this.props.dispatch(AddUrlActions.invalidRssUrl());
        }
    }

    _onKeyDownInputBox(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this._addUrl();
        }
    }

    render() {
        if (!this.props.addUrlStatus.added) {        //eslint-disable-line no-magic-numbers
            return (
                <div className="addurl">
                    <div className="addurl-helpmessage">
                        <span className="image"><img src="./../../../images/warning-icon.png"/></span>
                        <span className="text">
                            Sorry we are unable to find what your looking for.<br/>
                            Please enter the rss feed link below to add a new web news source.
                        </span>
                    </div>
                    <div className="addurl-inputcontainer">
                        <div className="addurl-input">
                            <input type="text" ref="url" onKeyDown={(event) => this._onKeyDownInputBox(event)} className="addurlinput"/>
                            <div className="addurl-icon"><img src="./../../../images/arrow-icon.png" onClick={() => { this._addUrl(); }}/></div>
                        </div>
                    </div>
                    { this.props.addUrlStatus.message && Toast.show(this.props.addUrlStatus.message) }
                </div>
            );
        }
        return (<div className="add-url-message">{Toast.show(this.props.addUrlStatus.message)}</div>);
    }
}

function mapToStore(store) {
    return {
        "addUrlStatus": store.addUrlMessage
    };
}

AddUrl.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "addUrlStatus": PropTypes.object
};

export default connect(mapToStore)(AddUrl);
