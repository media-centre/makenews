import React, { Component } from "react";
import UserInfo from "../../user/UserInfo.js";

export default class TwitterSuccess extends Component {
    componentWillMount() {
        UserInfo.createOrUpdateUserDocument({ "twitterAuthenticated": true }).then(() => {
            window.opener.mediaCenter.twitterLoginSucess = true;
            window.close();
        });
    }

    render() {
        return (<div>Login successful</div>); //eslint-disable-line react/jsx-no-literals
    }
}

TwitterSuccess.displayName = "TwitterSuccess";
