import React, { Component, PropTypes } from "react";
import SourcesResults from "./SourcesResults";
import { connect } from "react-redux";
import { facebookGetProfiles } from "./../actions/FacebookConfigureActions";

export class ConfigurePane extends Component {
    componentDidMount() {
        this.props.dispatch(facebookGetProfiles());
    }

    render() {
        return (
          <div className="configure-sources">
              <input type="text" ref="searchSources" className="search-sources" placeholder="Search...." />
              <SourcesResults sources={this.props.sources} dispatch={this.props.dispatch} />
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.facebookProfiles
    };
}

ConfigurePane.propTypes = {
    "sources": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(ConfigurePane);
