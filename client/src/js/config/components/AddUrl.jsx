/* eslint brace-style:0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import * as AddUrlActions from "../actions/AddUrlActions";
import { connect } from "react-redux";
import Toast from "../../utils/custom_templates/Toast";
import { PAGES } from "./../../config/actions/FacebookConfigureActions";
import { WEB, TWITTER } from "./../../sourceConfig/actions/SourceConfigurationActions";
import Locale from "./../../utils/Locale";

export class AddUrl extends Component {

    constructor() {
        super();
        this.urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; //eslint-disable-line max-len
    }

    _addUrl() {
        const addCustomUrl = Locale.applicationStrings().messages.configurePage.addCustomUrl;
        const url = this.refs.url.value.trim();
        if(url) {
            if (this.props.currentTab === WEB) {
                if (url.match(this.urlRegex)) {
                    this.props.dispatch(AddUrlActions.addRssUrl(url));
                } else {
                    Toast.show(addCustomUrl.messages.validateUrl);
                }
            } else if (this.props.currentTab === PAGES) {
                this.props.dispatch(AddUrlActions.addFacebookPage(url));

            } else if (this.props.currentTab === TWITTER) {
                this.props.dispatch(AddUrlActions.addTwitterHandle(url));
            }
        }
    }

    _onKeyDownInputBox(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this._addUrl();
        }
    }

    render() {
        const addCustomUrl = Locale.applicationStrings().messages.configurePage.addCustomUrl;
        return (
            <div className="add-url">
                <div className="add-url__message">
                    <span className="image"><img src="./../../../images/warning-icon.png"/></span>
                    <span className="text">
                        {addCustomUrl.description[this.props.currentTab]}
                    </span>
                    <button className="close" onClick={() => {
                        this.props.dispatch(AddUrlActions.showAddUrl(false));
                    }}
                    >
                        &times;
                    </button>
                </div>
                <div className="input-box">
                    <div className="input-container">
                        <input
                            type="text"
                            ref="url"
                            onKeyDown={(event) => this._onKeyDownInputBox(event)}
                            className="add-url__input"
                            placeholder={`Ex: ${addCustomUrl.exampleUrls[this.props.currentTab]}`}
                        />
                        <span className="input-addon">
                            <img src="./../../../images/arrow-icon.png" onClick={() => { this._addUrl(); }}/>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "currentTab": store.currentSourceTab
    };
}

AddUrl.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired
};

export default connect(mapToStore)(AddUrl);
