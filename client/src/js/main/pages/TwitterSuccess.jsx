import React, { Component } from "react";
import Locale from "./../../utils/Locale";

export default class TwitterSuccess extends Component {
    componentWillMount() {
        window.opener.mediaCenter.twitterLoginSucess = true;
        window.close();
    }

    render() {
        const twitter = Locale.applicationStrings().twitter;
        return (<div>{twitter.loginSuccess}</div>);
    }
}

TwitterSuccess.displayName = "TwitterSuccess";
