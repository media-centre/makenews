/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import { connect } from "react-redux";
import { getSourcesOf, getConfiguredProfiles, PROFILES } from "./../actions/FacebookConfigureActions";
import StringUtils from "../../../../../common/src/util/StringUtil";

export class ConfigurePane extends Component {
    componentDidMount() {
        this.props.dispatch(getSourcesOf(this.props.currentTab));
        this.props.dispatch(getConfiguredProfiles());
    }

    fetchSources(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            let value = this.refs.searchSources.value;
            if(this.props.currentTab !== PROFILES && !StringUtils.isEmptyString(value)) {
                this.props.dispatch(getSourcesOf(this.props.currentTab, value));
            }
        }
    }

    render() {
        return (
          <div className="configure-sources">
              <input type="text" ref="searchSources" onKeyUp ={(event) => { this.fetchSources(event); }} className="search-sources" placeholder="Search...." />
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
