/* eslint brace-style:0 */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as AddUrlActions from "../actions/AddUrlActions";
import { connect } from "react-redux";
import Toast from "../../utils/custom_templates/Toast";
import { PAGES } from "./../../config/actions/FacebookConfigureActions";
import { WEB, TWITTER } from "./../../sourceConfig/actions/SourceConfigurationActions";
import Locale from "./../../utils/Locale";

export class AddUrl extends PureComponent {

    constructor() {
        super();
        this.urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; //eslint-disable-line max-len
        this._closeAddCustomUrlPopup = this._closeAddCustomUrlPopup.bind(this);
        this._addUrl = this._addUrl.bind(this);
        this._onKeyDownInputBox = this._onKeyDownInputBox.bind(this);
    }

    _addUrl() {
        const url = this.refs.url.value.trim();
        if(url) {
            if (this.props.currentTab === WEB) {
                if (url.match(this.urlRegex)) {
                    this.props.dispatch(AddUrlActions.addRssUrl(url));
                } else {
                    Toast.show(this.addCustomUrl.messages.validateUrl);
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

    _closeAddCustomUrlPopup() {
        this.props.dispatch(AddUrlActions.showAddUrl(false));
    }

    render() {
        this.addCustomUrl = Locale.applicationStrings().messages.configurePage.addCustomUrl;
        return (
            <div className="add-url">
                <div className="add-url__message">
                    <span className="image"><img src="./../../../images/warning-icon.png"/></span>
                    <span className="text">
                        {this.addCustomUrl.description[this.props.currentTab]}
                    </span>
                    <button className="close" onClick={this._closeAddCustomUrlPopup}>
                        &times;
                    </button>
                </div>
                <div className="input-box">
                    <div className="input-container">
                        <input
                            type="text"
                            ref="url"
                            onKeyDown={this._onKeyDownInputBox}
                            className="add-url__input"
                            placeholder={`Ex: ${this.addCustomUrl.exampleUrls[this.props.currentTab]}`}
                            autoFocus
                        />
                        <span className="input-addon">
                            <img src="./../../../images/arrow-icon.png" onClick={this._addUrl}/>
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
