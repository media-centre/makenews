/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import ConfigPaneNavigation from "./ConfigPaneNavigation";
import { connect } from "react-redux";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import { handleMessages } from "../actions/AddUrlActions";
import StringUtils from "../../../../../common/src/util/StringUtil";
import AddUrl from "./AddUrl";
import SignInWarning from "./SignInWarning";

export class ConfigurePane extends Component {

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentTab !== this.props.currentTab) {
            this.fetchSources(nextProps.currentTab);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(SourceConfigActions.clearSources);
        this.props.dispatch(SourceConfigActions.fetchingSourcesFailed(""));
    }

    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.fetchSources();
        }
    }

    fetchSources(currentTab = this.props.currentTab) {
        if ((this.props.currentSourceType === "facebook" && this.props.sourcesAuthenticationInfo.facebook) ||
                (this.props.currentSourceType === "twitter" && this.props.sourcesAuthenticationInfo.twitter) ||
                (this.props.currentSourceType === "web")) {
            const value = this.refs.searchSources.value;
            if (!StringUtils.isEmptyString(value)) {
                this.props.dispatch(handleMessages(""));
                this.props.dispatch(SourceConfigActions.clearSources);
                this.props.dispatch(SourceConfigActions.getSources(currentTab, value));
            }
        }
    }

    render() {
        return (
          <div className="configure-sources">
              <ConfigPaneNavigation currentSourceType={this.props.currentSourceType} fbLogin={this.props.fbLogin} twitterLogin={this.props.twitterLogin}/>
              { (this.props.currentSourceType === "facebook" && this.props.sourcesAuthenticationInfo.facebook) ||
                (this.props.currentSourceType === "twitter" && this.props.sourcesAuthenticationInfo.twitter) ||
                (this.props.currentSourceType === "web")
                  ? <div>
                      <div className="input-box">
                          <div className="input-container">
                              <input type="text" ref="searchSources" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={`Search ${this.props.currentTab}....`} />
                          <span className="input-addon">
                            <img className="image" src="./images/search-icon.png" alt="search" onClick={() => { this.fetchSources(); }}/>
                          </span>
                          </div>
                      </div>
                      { this.props.currentTab === SourceConfigActions.WEB &&
                      !this.props.sources.data.length && !this.props.sources.isFetchingSources
                          ? <AddUrl/>
                          : <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/> }
                  </div>
                  : <SignInWarning currentSourceType = {this.props.currentSourceType}/>
              }

          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "currentTab": state.currentSourceTab,
        "sources": state.sourceResults,
        "sourcesAuthenticationInfo": state.sourcesAuthenticationInfo
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "sources": PropTypes.object.isRequired,
    "currentSourceType": PropTypes.string.isRequired,
    "sourcesAuthenticationInfo": PropTypes.object,
    "fbLogin": PropTypes.func,
    "twitterLogin": PropTypes.func
};

export default connect(mapToStore)(ConfigurePane);
