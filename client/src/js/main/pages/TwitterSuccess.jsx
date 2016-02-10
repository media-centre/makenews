"use strict";
import React, { Component } from "react";
import FacebookTwitterDb from "../../socialAccounts/FacebookTwitterDb.js";

export default class TwitterSuccess extends Component {
    componentWillMount() {
        FacebookTwitterDb.createOrUpdateTokenDocument({ "twitterAuthenticated": true }).then(() => {
            window.opener.mediaCenter.twitterLoginSucess = true;
            window.close();
        });
    }

    render() {
        return (<div>Login successful</div>); //eslint-disable-line react/jsx-no-literals
    }
}

TwitterSuccess.displayName = "TwitterSuccess";
