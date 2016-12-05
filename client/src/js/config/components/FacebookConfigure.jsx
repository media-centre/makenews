import React, { Component } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";

export default class FacebookConfigure extends Component {
    render() {
        return (
            <div className="configure-container">
                <ConfiguredSources />
                <ConfigurePane />
            </div>
        );
    }
}
