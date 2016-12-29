/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import { connect } from "react-redux";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import StringUtils from "../../../../../common/src/util/StringUtil";
import AddUrl from "./AddUrl";

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
            this.props.dispatch(SourceConfigActions.clearSources());
            this.props.dispatch(SourceConfigActions.searchSourceKeyword(value));
            this.props.dispatch(SourceConfigActions.getSources(this.props.currentTab, value));
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
              { this.props.sources.data.length || this.props.hasMoreSourceResults
                  ? <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/>
                  : <AddUrl/>
              }
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.currentSourceTab,
        "hasMoreSourceResults": state.hasMoreSourceResults,
        "sources": state.sourceResults
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "hasMoreSourceResults": PropTypes.bool.isRequired,
    "sources": PropTypes.object.isRequired
};

export default connect(mapToStore)(ConfigurePane);
