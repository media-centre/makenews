/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
import React, { Component, PropTypes } from "react";
import { addRssUrlAsync } from "../actions/CategoryActions";
import AddURLComponent from "../../utils/components/AddURLComponent";
import Toast from "../../utils/custom_templates/Toast";

export default class RSSComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { "hintMessage": this.props.categoryDetailsPageStrings.hintMessages.RSSHintMessage, "exampleMessage": this.props.categoryDetailsPageStrings.exampleMessages.RSSExampleURL, "errorMessage": "" };
    }

    _validateUrl(url, callback, props) {
        props.dispatch(addRssUrlAsync(props.categoryId, url, (response)=> {
            let urlStatus = response === "invalid" ? this.props.categoryDetailsPageStrings.errorMessages.invalidRssUrl : this.props.categoryDetailsPageStrings.successMessages.urlSuccess;
            if(response !== "invalid") {
                Toast.show(`RSS ${urlStatus}`);
            }
            return callback({ "error": urlStatus, "urlAdded": response === "valid" });
        }));
    }

    render() {
        return (
            <AddURLComponent exampleMessage = {this.state.exampleMessage} hintMessage = {this.state.hintMessage} dispatch = {this.props.dispatch} categoryId = {this.props.categoryId} content={this.props.content} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addRSSUrlLinkLabel} errorMessage={this.state.errorMessage} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)}/>
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

