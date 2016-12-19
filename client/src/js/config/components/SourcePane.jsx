import React, { Component, PropTypes } from "react";
import Sources from "./Sources";
import FacebookTabs from "./FacebookTabs";
import { WEB, TWITTER, addAllSources } from "./../../sourceConfig/actions/SourceConfigurationActions";
import R from "ramda"; //eslint-disable-line id-length

export default class SourcePane extends Component {

    render() {
        return (
            <div className="sources-suggestions">
                {!(R.contains(this.props.currentTab, [WEB, TWITTER])) && <FacebookTabs />}
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
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};
