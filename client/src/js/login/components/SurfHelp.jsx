"use strict";
import React, { Component, PropTypes} from "react";

export default class SurfHelp extends Component {
    render() {
        return (
            <div className="static-block">
                <div className="image-block circle blue-bg bottom-box-shadow">
                    <img ref="image" src={"images/main/surf.png"}/>
                </div>

                <div className="content-block bottom-box-shadow">
                    <h4 ref="name">{this.props.surfHelp.name}</h4>
                    <p className="t-left" ref="text">{this.props.surfHelp.text}</p>
                </div>
            </div>
        );
    }
}


SurfHelp.displayName = "Surf Help";
SurfHelp.propTypes = {
    "surfHelp": PropTypes.object.isRequired
};