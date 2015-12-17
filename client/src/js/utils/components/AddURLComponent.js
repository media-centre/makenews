/* eslint max-len:0, react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";

let urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

export default class AddURLComponent extends Component {

    constructor(props) {
        super(props);

        this.state = { "showUrlInput": false, "errorMessage": this.props.errorMessage, "successResponse": false };
    }

    _showAddUrlTextBox() {
        this.setState({ "showUrlInput": true, "errorMessage": "", "successResponse": true });
    }

    _onKeyDownTextBox(event) {
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            this._validateUrl();
        }
    }

    _validateUrl() {
        let url = this.refs.addUrlTextBox.value.trim();
        let errorMessage = this._isValidUrl(url);
        this.setState({ "errorMessage": errorMessage, "successResponse": false });
        if(errorMessage.length === 0) {
            this.setState({ "errorMessage": this.props.categoryDetailsPageStrings.errorMessages.validatingUrl, "successResponse": false });
            this.props.sourceDomainValidation(url, (response)=> {
                let show = response.error !== this.props.categoryDetailsPageStrings.errorMessages.urlSuccess;
                this.setState({ "errorMessage": response.error, "successResponse": !show });
                this.setState({ "showUrlInput": response.urlAdded ? false : true });
            });
        }
    }

    _isValidUrl(url) {
        if(!this.props.noValidation && !url.match(urlRegex)) {
            return url ? this.props.categoryDetailsPageStrings.errorMessages.invalidUrlFormat : this.props.categoryDetailsPageStrings.errorMessages.emptyUrl;
        }

        let result = "";
        this.props.content.some((obj)=> {
            if(obj.url.toLowerCase().trim() === url.toLowerCase().trim()) {
                result = this.props.categoryDetailsPageStrings.errorMessages.alreadyAdded;
            }
        });
        return result;
    }

    render() {

        let inputBox = null;
        if(this.state.showUrlInput) {
            let addUrlClasses = this.state.errorMessage ? "add-url-input box error-border" : "add-url-input box";
            inputBox = (
                <div>
                    <input type="text" ref="addUrlTextBox" autoFocus className={addUrlClasses} placeholder="Enter url here" onBlur={()=> this._validateUrl()} onKeyDown={(event) => this._onKeyDownTextBox(event)}/>
                </div>
            );
        }


        return (
            <div>

                <div className="nav-control h-center" id="addNewUrlButton" onClick={() => this._showAddUrlTextBox()}>
                    <i className="fa fa-plus"></i><span ref="addUrlLinkText">{this.props.addUrlLinkLabel}</span>
                </div>

                <div className="url-panel">
                    <ul className="url-list">
                        {this.props.content.map((urlObj, index) =>
                            <li key={index} className="feed-url">
                                <div className={urlObj.status + " feed"}>{urlObj.url}</div>
                                <i className="border-blue circle fa fa-close close circle"></i>
                            </li>
                        )}
                    </ul>

                    {inputBox}
                    <div className={this.state.successResponse ? "add-url-status success-message" : "add-url-status error-message"}>{this.state.errorMessage}</div>

                </div>

            </div>


        );
    }
}

AddURLComponent.displayName = "AddURLComponent";

AddURLComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "addUrlLinkLabel": PropTypes.string.isRequired,
    "errorMessage": PropTypes.string.isRequired,
    "sourceDomainValidation": PropTypes.func.isRequired,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "noValidation": PropTypes.bool
};
AddURLComponent.defaultProps = {
    "noValidation": false,
    "categoryDetailsPageStrings": PropTypes.object.isRequired
};
