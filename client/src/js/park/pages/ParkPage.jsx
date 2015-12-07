"use strict";
import React, { Component } from "react";

export default class ParkPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                {"Park"}
            </div>
        );
    }
}

ParkPage.displayName = "ParkPage";
