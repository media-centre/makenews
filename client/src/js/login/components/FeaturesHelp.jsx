"use strict";
import ConfigureHelp from "./ConfigureHelp.jsx";
import SurfHelp from "./SurfHelp.jsx";
import ParkHelp from "./ParkHelp.jsx";
import React, { Component, PropTypes } from "react";

export default class FeaturesHelp extends Component {
    render() {
        return (
            <div className="container h-center t-center">
                <ConfigureHelp ref="configureFeatureHelp" configureHelp={this.props.featuresHelp.configureHelp} />
                <SurfHelp ref="surfFeatureHelp" surfHelp={this.props.featuresHelp.surfHelp} />
                <ParkHelp ref="parkFeatureHelp" parkHelp={this.props.featuresHelp.parkHelp} />
            </div>
        );
    }
}


FeaturesHelp.displayName = "Configure Help";
FeaturesHelp.propTypes = {
    "featuresHelp": PropTypes.object.isRequired
};
