/* eslint brace-style:0, react/jsx-no-literals:0*/
import React, { Component, PropTypes } from "react";
import { addRssUrl } from "../actions/AddUrlActions";
import { connect } from "react-redux";

let urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; //eslint-disable-line max-len

export class AddUrl extends Component {
    addUrl() {
        let url = this.refs.url.value.trim();
        if(url.match(urlRegex)) {
            this.props.dispatch(addRssUrl(url));
        }
    }

    render() {
        return (
            <div className="addurl">
                <div className="addurl-helpmessage">
                    <span className="image"><img src="./../../../images/warning-icon.png"/></span>
                    <span className="text">
                        Sorry we are unable to find what your looking for.Please enter the rss feed link below to add a new web news source.</span>
                </div>
                <div className="addurl-inputcontainer">
                    <input type="text" ref="url" className="addurl-input"/>
                    <span className="addurl-icon"><img src="./../../../images/arrow-icon.png" onClick={() => { this.addUrl(); }}/></span>
                </div>
                <div><h1>{this.props.message}</h1></div>
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "message": store.addUrlMessage
    };
}

AddUrl.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "message": PropTypes.string.isRequired
};

export default connect(mapToStore)(AddUrl);
