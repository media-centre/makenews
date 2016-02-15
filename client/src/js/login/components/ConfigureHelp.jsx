"use strict";
import React, { Component, PropTypes } from "react";

export default class ConfigureHelp extends Component {
    render() {
        return (
            <div className="static-block">
                <div className="image-block circle blue-bg bottom-box-shadow">
                    <img ref="image" src={"images/main/configure.png"}/>
                </div>

                <div className="content-block bottom-box-shadow">
                    <h4 ref="name">{this.props.configureHelp.name}</h4>
                    <p className="t-justify" ref="text">{this.props.configureHelp.text}</p>
                </div>
            </div>
        );
    }
}


ConfigureHelp.displayName = "Configure Help";
ConfigureHelp.propTypes = {
    "configureHelp": PropTypes.object.isRequired
};
