import React, { Component } from "react";
import Sources from "./Sources";
import FacebookTabs from "./FacebookTabs";

export default class SourcePane extends Component {

    render() {
        return (
            <div className="sources-suggestions">
                <FacebookTabs />
                <button className="add-all">
                    <img src="./images/add-btn-dark.png"/>
                    {"Add All"}
                </button>
                <Sources />
            </div>
        );
    }
}
