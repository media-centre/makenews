import React, { Component, PropTypes } from "react";
import Sources from "./Sources";
import FacebookTabs from "./FacebookTabs";
import { addAllSources } from "./../actions/FacebookConfigureActions";

export default class SourcePane extends Component {

    render() {
        return (
            <div className="sources-suggestions">
                <FacebookTabs />
                <button className="add-all" onClick= {() => {
                    this.props.dispatch(addAllSources());
                }}
                >
                    <img src="./images/add-btn-dark.png"/>
                    {"Add All"}
                </button>
                <Sources />
            </div>
        );
    }
}

SourcePane.propTypes = {
    "dispatch": PropTypes.func.isRequired
};
