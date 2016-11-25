import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import { connect } from "react-redux";
import { getSourcesOf, getConfiguredProfiles } from "./../actions/FacebookConfigureActions";

export class ConfigurePane extends Component {
    componentDidMount() {
        this.props.dispatch(getSourcesOf(this.props.currentTab));
        this.props.dispatch(getConfiguredProfiles());
    }

    render() {
        return (
          <div className="configure-sources">
              <input type="text" ref="searchSources" className="search-sources" placeholder="Search...." />
              <SourcePane />
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.facebookCurrentSourceTab
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(ConfigurePane);
