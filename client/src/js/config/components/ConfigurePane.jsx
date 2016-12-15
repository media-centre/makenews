/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import { connect } from "react-redux";
import { getSourcesOf } from "./../actions/FacebookConfigureActions";
import { clearSources } from "./../../sourceConfig/actions/SourceConfigurationActions";
import StringUtils from "../../../../../common/src/util/StringUtil";

export class ConfigurePane extends Component {
    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.fetchSources();
        }
    }

    fetchSources() {
        let value = this.refs.searchSources.value;
        if(!StringUtils.isEmptyString(value)) {
            this.props.dispatch(clearSources());
            this.props.dispatch(getSourcesOf(this.props.currentTab, value));
        }
    }

    render() {
        return (
          <div className="configure-sources">
              <div className="input-group">
                  <input type="text" ref="searchSources" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={`Search ${this.props.currentTab}....`} />
                  <span className="input-group__addon">
                    <img src="./images/search-icon.png" alt="search" onClick={() => { this.fetchSources(); }}/>
                  </span>
              </div>
              <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/>
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.currentSourceTab
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(ConfigurePane);
