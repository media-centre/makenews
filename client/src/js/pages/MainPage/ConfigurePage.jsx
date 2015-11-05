"use strict";
import React, { Component } from "react";

export default class ConfigurePage extends Component {
    render() {
        return (
            <div className="configure-page">
                <h4 className="t-center">
                    {"All categories"}
                </h4>
                <div className="categories">
                    <ul className="cat-list m-t-center">
                        <li className="add-new"><div className="v-center t-center">
                            {"Add new category"}
                        </div></li>
                        <li className="category"><div className="v-center t-center">
                            {"Timeline"}
                        </div></li>
                    </ul>
                </div>
            </div>
        );
    }
}

ConfigurePage.displayName = "ConfigurePage";
