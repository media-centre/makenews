/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addFacebookUrlAsync } from "../actions/CategoryActions.js";
import AddURLComponent from "../../utils/components/AddURLComponent.js";
import FacebookLogin from "../../facebook/FacebookLogin";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookDb from "./../../facebook/FacebookDb";
import Toast from "../../utils/custom_templates/Toast.js";

export const fbRegex = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
export default class FacebookComponent extends Component {


    constructor(props) {
        super(props);
        this.facebookLoginHandler = this.facebookLoginHandler.bind(this);
        this.state = { "exampleMessage": this.props.categoryDetailsPageStrings.hintMessages.FacebookExampleURL, "errorMessage": "", "hintMessage": "Please Enter Facebook url" };
    }

    componentWillMount() {
        this.fbLogin = FacebookLogin.instance();
    }

    _validateUrl(url, callback, props) {
        if(!url) {
            return callback({ "error": this.props.categoryDetailsPageStrings.errorMessages.emptyUrl });
        }
        if(url.match(fbRegex)) {
            let facebookURL = url.split("?")[0];
            props.dispatch(addFacebookUrlAsync(props.categoryId, facebookURL, (response)=> {
                let urlStatus = response === "invalid" ? this.props.categoryDetailsPageStrings.errorMessages.noFbAccess : this.props.categoryDetailsPageStrings.successMessages.urlSuccess;
                if(response !== "invalid") {
                    Toast.show(`Facebook ${urlStatus}`);
                }
                return callback({ "error": urlStatus, "urlAdded": response === "valid" });
            }));
        } else {
            return callback({ "error": this.props.categoryDetailsPageStrings.errorMessages.invalidFacebookUrl });
        }
    }

    facebookLoginHandler() {
        return this.fbLogin.login();
    }

    render() {
        return (
            <AddURLComponent exampleMessage = {this.state.exampleMessage} hintMessage = {this.state.hintMessage} dispatch = {this.props.dispatch} categoryId = {this.props.categoryId} content={this.props.content} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addUrlLinkLabel} errorMessage={this.state.errorMessage} addURLHandler= {this.facebookLoginHandler} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)} noValidation/>
        );
    }
}

FacebookComponent.displayName = "FacebookComponent";
FacebookComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "content.details": PropTypes.array,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "categoryId": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

