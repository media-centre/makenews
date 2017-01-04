/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import { connect } from "react-redux";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import { handleMessages } from "../actions/AddUrlActions";
import StringUtils from "../../../../../common/src/util/StringUtil";
import AddUrl from "./AddUrl";

export class ConfigurePane extends Component {

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentTab !== this.props.currentTab) {
            this.fetchSources(nextProps.currentTab);
        }
    }

    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.fetchSources();
        }
    }

    fetchSources(currentTab = this.props.currentTab) {
        let value = this.refs.searchSources.value;
        if(!StringUtils.isEmptyString(value)) {
            this.props.dispatch(handleMessages(""));
            this.props.dispatch(SourceConfigActions.clearSources());
            this.props.dispatch(SourceConfigActions.searchSourceKeyword(value));
            this.props.dispatch(SourceConfigActions.getSources(currentTab, value));
        }
    }

    render() {
        return (
          <div className="configure-sources">
              <div className="input-group">
                  <input type="text" ref="searchSources" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={`Search ${this.props.currentTab}....`} />
                  <span className="input-group__addon">
                    <img className="image" src="./images/search-icon.png" alt="search" onClick={() => { this.fetchSources(); }}/>
                  </span>
              </div>
              { this.props.searchKeyword && !this.props.sources.data.length
                  ? <AddUrl/>
                  : <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/>
              }
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.currentSourceTab,
        "searchKeyword": state.sourceSearchKeyword,
        "sources": state.sourceResults
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "searchKeyword": PropTypes.string.isRequired,
    "sources": PropTypes.object.isRequired
};

export default connect(mapToStore)(ConfigurePane);
