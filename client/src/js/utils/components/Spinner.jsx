/* eslint react/jsx-wrap-multilines:0 react/self-closing-comp:0 */
import React, { Component } from "react";

export default class Spinner extends Component {
    render() {
        return (
            <div className="custom-spinner">
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div>
        );
    }
}

Spinner.displayName = "Spinner";
