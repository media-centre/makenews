/* eslint max-len:0, react/no-set-state:0 react/jsx-no-literals:0 */
/* eslint react/no-set-state:0  react/jsx-wrap-multilines:0 */

import React, { Component, PropTypes } from "react";
import Source from "../../config/Source";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import { populateCategoryDetailsAsync } from "../../config/actions/CategoryActions";
import Toast from "../custom_templates/Toast";
import { getLatestFeedsFromAllSources } from "../../surf/actions/SurfActions";

let urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; //eslint-disable-line max-len

export default class AddURLComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "showUrlInput": false,
            "errorMessage": this.props.errorMessage,
            "successResponse": false,
            "showCustomPopup": false
        };
    }

    _showAddUrlTextBox() {
        if (this.props.addURLHandler) {
            this.props.addURLHandler().then((response) => {
                if (response) {
                    this.setState({ "showUrlInput": true, "errorMessage": "", "successResponse": true });
                }
            }).catch(() => {
                return;
            });
        } else {
            this.setState({ "showUrlInput": true, "errorMessage": "", "successResponse": true });
        }
    }

    _showConfirmPopup(sourceObject) {
        this.setState({ "showCustomPopup": true, "currentSourceId": sourceObject._id, "sourceObject": sourceObject });
    }

    handleDeleteClick(event) {
        if (event.OK) {
            let source = new Source(this.state.sourceObject);
            source.delete(this.props.categoryId).then(()=> {
                this.props.dispatch(populateCategoryDetailsAsync(this.props.categoryId));
                this.props.dispatch(getLatestFeedsFromAllSources());
                this.setState({
                    "showCustomPopup": false,
                    "successResponse": true,
                    "errorMessage": this.props.categoryDetailsPageStrings.successMessages.urlDeleteSuccess
                });
                Toast.show(this.props.categoryDetailsPageStrings.successMessages.urlDeleteSuccess);
            }).catch(()=> {
                this.setState({
                    "showCustomPopup": false,
                    "successResponse": false,
                    "errorMessage": this.props.categoryDetailsPageStrings.errorMessages.urlDeleteFailed
                });
            });
        } else {
            this.setState({ "showCustomPopup": false });
        }
    }

    _onKeyDownTextBox(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this._validateUrl();
        }
    }

    _validateUrl() {
        let url = this.refs.addUrlTextBox.value.trim();
        let errorMessage = this._isValidUrl(url);
        this.setState({ "errorMessage": errorMessage, "successResponse": false });
        if (errorMessage.length === 0) { //eslint-disable-line no-magic-numbers
            this.setState({
                "errorMessage": this.props.categoryDetailsPageStrings.errorMessages.validatingUrl,
                "successResponse": false
            });
            this.props.sourceDomainValidation(url, (response)=> {
                let isSuccessResponse = response.error === this.props.categoryDetailsPageStrings.successMessages.urlSuccess;
                this.setState({
                    "showUrlInput": !response.urlAdded,
                    "errorMessage": response.error,
                    "successResponse": isSuccessResponse
                });
            });
        }
    }

    _isValidUrl(url) {
        if (!this.props.noValidation && !url.match(urlRegex)) {
            return url ? this.props.categoryDetailsPageStrings.errorMessages.invalidRssUrl : this.props.categoryDetailsPageStrings.errorMessages.emptyUrl;
        }

        let result = "";
        this.props.content.some((obj)=> {
            if (obj.url.toLowerCase().trim() === url.toLowerCase().trim()) {
                result = this.props.categoryDetailsPageStrings.errorMessages.alreadyAdded;
            }
        });
        return result;
    }

    getUrlList() {
        //test
        let increment = 1;
        let urlsList = [];
        urlsList.push(
            <li key={0}>
                <div className="example-url" ref="exampleText">{this.props.exampleMessage}</div>
            </li>);
        this.props.content.map((urlObj, index) =>
            urlsList.push(
                <li key={index + increment} className="feed-url">
                    <div className={urlObj.status + " feed"}>{urlObj.url}</div>
                    <div id="deleteUrlButton" onClick={() => this._showConfirmPopup(urlObj)}>
                        <i className="border-blue circle fa fa-close close circle"/>
                    </div>
                </li>)
        );
        return urlsList;
    }

    render() {
        let inputBox = null, confirmPopup = null;
        if (this.state.showUrlInput) {
            let addUrlClasses = this.state.errorMessage ? "add-url-input box error-border" : "add-url-input box";
            inputBox = (
                <div>
                    <input type="text" ref="addUrlTextBox" autoFocus className={addUrlClasses}
                        placeholder={this.props.hintMessage} onBlur={()=> this._validateUrl()}
                        onKeyDown={(event) => this._onKeyDownTextBox(event)}
                    />
                </div>
            );
        }

        confirmPopup = this.state.showCustomPopup
            ? (<ConfirmPopup description={this.props.categoryDetailsPageStrings.deleteURLConfirm}
                callback={(event)=> this.handleDeleteClick(event)}
               />) : null;

        return (
            <div>

                <div className="nav-control h-center" id="addNewUrlButton" onClick={() => this._showAddUrlTextBox()}>
                    <i className="fa fa-plus"/>
                    <span ref="addUrlLinkText">{this.props.addUrlLinkLabel}</span>
                </div>

                <div className="url-panel">
                    <ul className="url-list">
                        {this.getUrlList()}
                    </ul>
                    {inputBox}
                    {this.state.successResponse ? ""
                        : <div className="add-url-status error-message">{this.state.errorMessage}</div>}
                </div>
                {confirmPopup}

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
    "noValidation": PropTypes.bool,
    "categoryId": PropTypes.string.isRequired,
    "dispatch": PropTypes.func,
    "addURLHandler": PropTypes.func,
    "hintMessage": PropTypes.string.isRequired,
    "exampleMessage": PropTypes.string.isRequired
};
AddURLComponent.defaultProps = {
    "noValidation": false,
    "categoryDetailsPageStrings": PropTypes.object.isRequired
};
