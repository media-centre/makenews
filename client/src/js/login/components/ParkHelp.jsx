"use strict";
import React, { Component, PropTypes } from "react";

export default class ParkHelp extends Component {
    render() {
        return (
            <div className="static-block">
                <div className="image-block circle blue-bg bottom-box-shadow">
                    <img ref="image" src={"images/main/park.png"}/>
                </div>

                <div className="content-block bottom-box-shadow">
                    <h4 ref="name">{this.props.parkHelp.name}</h4>
                    <p className="t-justify" ref="text">{this.props.parkHelp.text}</p>
                </div>
            </div>
        );
    }
}


ParkHelp.displayName = "Park Help";
ParkHelp.propTypes = {
    "parkHelp": PropTypes.object.isRequired
};
