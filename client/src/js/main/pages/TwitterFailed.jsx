import React, { Component } from "react";

export default class TwitterSuccess extends Component {
    componentWillMount() {
        window.close();
    }

    render() {
        return (<div>Login failed</div>);
    }
}
