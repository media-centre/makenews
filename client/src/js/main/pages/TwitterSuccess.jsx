import React, { Component } from "react";

export default class TwitterSuccess extends Component {
    componentWillMount() {
        window.opener.mediaCenter.twitterLoginSucess = true;
        window.close();
    }

    render() {
        return (<div>Login successful</div>); //eslint-disable-line react/jsx-no-literals
    }
}

TwitterSuccess.displayName = "TwitterSuccess";
