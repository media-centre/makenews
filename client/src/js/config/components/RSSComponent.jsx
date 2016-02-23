/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addRssUrlAsync } from "../actions/CategoryActions.js";
import AddURLComponent from "../../utils/components/AddURLComponent.js";
import Toast from "../../utils/custom_templates/Toast.js";

export default class RSSComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { "hintMessage": "Please enter RSS URL here", "exampleMessage": this.props.categoryDetailsPageStrings.hintMessages.RSSExampleURL, "errorMessage": "" };
    }

    _validateUrl(url, callback, props) {
        props.dispatch(addRssUrlAsync(props.categoryId, url, (response)=> {
            let urlStatus = response === "invalid" ? this.props.categoryDetailsPageStrings.errorMessages.noSuchUrl : this.props.categoryDetailsPageStrings.successMessages.urlSuccess;
            if(response !== "invalid") {
                Toast.show(`RSS ${urlStatus}`);
            }
            return callback({ "error": urlStatus, "urlAdded": response === "valid" });
        }));
    }

    render() {
        return (
            <AddURLComponent exampleMessage = {this.state.exampleMessage} hintMessage = {this.state.hintMessage} dispatch = {this.props.dispatch} categoryId = {this.props.categoryId} content={this.props.content} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addUrlLinkLabel} errorMessage={this.state.errorMessage} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)}/>
        );
    }
}

RSSComponent.displayName = "RSSComponent";
RSSComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "content.details": PropTypes.array,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "categoryId": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

