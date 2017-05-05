/* eslint brace-style:0*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import SourcePane from "./SourcePane";
import ConfigPaneNavigation from "./ConfigPaneNavigation";
import { connect } from "react-redux";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import SignInWarning from "./SignInWarning";
import History from "./../../History";
import R from "ramda"; //eslint-disable-line id-length
import { showAddUrl } from "./../actions/AddUrlActions";
import AppSessionStorage from "../../utils/AppSessionStorage";
import Locale from "./../../utils/Locale";
import Input from "./../../utils/components/Input";

export class ConfigurePane extends Component {

    constructor() {
        super();
        this.state = { "showConfigurationWarning": false };
        this.checkConfiguredSources = this.checkConfiguredSources.bind(this);
        this._closeConfigurationWarning = this._closeConfigurationWarning.bind(this);
        this.appSessionStorage = AppSessionStorage.instance();
        this._searchInSources = this._searchInSources.bind(this);
        this.fetchSources = this.fetchSources.bind(this);
    }

    componentWillMount() {
        this.fetchSources(this.props.currentSourceType);
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
        this.appSessionStorage.remove(AppSessionStorage.KEYS.FIRST_TIME_USER);
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

    _searchInSources() {
        const value = (this.refs.searchSources.refs.input.value).trim();
        this.fetchSources(this.props.currentTab, value);
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
        const configurePage = Locale.applicationStrings().messages.configurePage;
        return (
          <div className="configure-sources">
              <ConfigPaneNavigation currentSourceType={this.props.currentSourceType} fbLogin={this.props.fbLogin} twitterLogin={this.props.twitterLogin} checkConfiguredSources={this.checkConfiguredSources}/>
              { this.state.showConfigurationWarning &&
                  <div className="configuration-warning">
                      <i className="warning-icon" />
                      <span className="warning-message">{configurePage.warningMessages.configureAtLeastOneSource}</span>
                      <span className="close" onClick={this._closeConfigurationWarning}>&times;</span>
                  </div>
              }
              { (this.props.currentSourceType === "facebook" && this.props.sourcesAuthenticationInfo.facebook) ||
                (this.props.currentSourceType === "twitter" && this.props.sourcesAuthenticationInfo.twitter) ||
                (this.props.currentSourceType === "web")
                  ? <div>
                      <Input ref="searchSources" className={"input-box configure-source"}
                          callback={this._searchInSources}
                          placeholder={`Search ${this.props.currentTab}....`}
                          addonSrc="search" callbackOnEnter
                      />
                      <SourcePane dispatch={this.props.dispatch} currentTab={this.props.currentTab}/>
                  </div>
                  : <SignInWarning currentSourceType = {this.props.currentSourceType} fbLogin={this.props.fbLogin} twitterLogin={this.props.twitterLogin}/>
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
