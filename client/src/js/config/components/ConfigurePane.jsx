/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import SourcePane from "./SourcePane";
import ConfigPaneNavigation from "./ConfigPaneNavigation";
import { connect } from "react-redux";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import StringUtils from "../../../../../common/src/util/StringUtil";
import SignInWarning from "./SignInWarning";
import History from "./../../History";
import R from "ramda"; //eslint-disable-line id-length
import { showAddUrl } from "./../actions/AddUrlActions";

export class ConfigurePane extends Component {

    constructor() {
        super();
        this.state = { "showConfigurationWarning": false };
        this.checkConfiguredSources = this.checkConfiguredSources.bind(this);
        this._closeConfigurationWarning = this._closeConfigurationWarning.bind(this);
    }

    componentWillMount() {
        this.fetchSources(this.props.currentTab);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentSourceType === SourceConfigActions.WEB || nextProps.sourcesAuthenticationInfo[nextProps.currentSourceType]) {
            const value = this.refs.searchSources ? this.refs.searchSources.value : "";
            if(nextProps.currentTab !== this.props.currentTab) {
                this.fetchSources(nextProps.currentTab, value);
                this.props.dispatch(showAddUrl(false));
            }
        }
    }

    componentWillUnmount() {
        this.props.dispatch(SourceConfigActions.clearSources);
    }

    _closeConfigurationWarning() {
        this.setState({ "showConfigurationWarning": false });
    }

    checkConfiguredSources() {
        const hasConfiguredSources = R.pipe(
            R.values,
            R.any(sources => sources.length)
        )(this.props.configuredSources);

        if (hasConfiguredSources) {
            History.getHistory().push("/newsBoard");
        } else {
            this.setState({ "showConfigurationWarning": true });
        }
    }

    checkEnterKey(event) {
        const value = (this.refs.searchSources.value).trim();
        const ENTERKEY = 13;

        if (StringUtils.isEmptyString(value) || event.keyCode === ENTERKEY) {
            this.fetchSources(this.props.currentTab, value);
        }
    }

    fetchSources(currentTab, value = "") {
        if (((currentTab === "pages" || currentTab === "groups") && this.props.sourcesAuthenticationInfo.facebook) ||
            (currentTab === "twitter" && this.props.sourcesAuthenticationInfo.twitter) ||
            (currentTab === "web")) {
            this.props.dispatch(SourceConfigActions.clearSources);
            this.props.dispatch(SourceConfigActions.getSources(currentTab, value));
        }
    }

    render() {
        return (
          <div className="configure-sources">
              <ConfigPaneNavigation currentSourceType={this.props.currentSourceType} fbLogin={this.props.fbLogin} twitterLogin={this.props.twitterLogin} checkConfiguredSources={this.checkConfiguredSources}/>
              { this.state.showConfigurationWarning &&
                  <div className="configuration-warning">
                      <i className="warning-icon" />
                      <span className="warning-message">Please select at least one source either from Web Urls or Facebook or Twitter</span>
                      <span className="close" onClick={this._closeConfigurationWarning}>&times;</span>
                  </div>
              }
              { (this.props.currentSourceType === "facebook" && this.props.sourcesAuthenticationInfo.facebook) ||
                (this.props.currentSourceType === "twitter" && this.props.sourcesAuthenticationInfo.twitter) ||
                (this.props.currentSourceType === "web")
                  ? <div>
                      <div className="input-box configure-source">
                          <div className="input-container">
                              <input type="text" ref="searchSources" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={`Search ${this.props.currentTab}....`} />
                          <span className="input-addon">
                            <img className="image" src="./images/search-icon.png" alt="search" onClick={() => { this.fetchSources(); }}/>
                          </span>
                          </div>
                      </div>
                      <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/>
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
        "sourcesAuthenticationInfo": state.sourcesAuthenticationInfo,
        "configuredSources": state.configuredSources
    };
}

ConfigurePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "sources": PropTypes.object.isRequired,
    "currentSourceType": PropTypes.string.isRequired,
    "sourcesAuthenticationInfo": PropTypes.object,
    "fbLogin": PropTypes.func,
    "twitterLogin": PropTypes.func,
    "configuredSources": PropTypes.object
};

export default connect(mapToStore)(ConfigurePane);
