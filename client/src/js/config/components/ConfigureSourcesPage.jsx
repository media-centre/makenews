import React, { Component } from "react";
import PropTypes from "prop-types";
import ConfiguredPane from "./ConfiguredPane";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { updateTokenExpiredInfo, isFBTokenExpired } from "./../../facebook/FacebookAction";
import { twitterAuthentication, twitterTokenInformation } from "./../../twitter/TwitterTokenActions";
import TwitterLogin from "./../../twitter/TwitterLogin";
import { sourceTypes, IS_MOBILE } from "./../../utils/Constants";
import History from "./../../History";
import R from "ramda"; //eslint-disable-line id-length
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import Locale from "./../../utils/Locale";

export class ConfigureSourcesPage extends Component {

    constructor() {
        super();
        this.facebookLogin = FacebookLogin.instance();
        this.login = false;
        this._showFBLogin = this._showFBLogin.bind(this);
        this._showTwitterLogin = this._showTwitterLogin.bind(this);
    }

    componentWillMount() {
        const mainHeaderStrings = Locale.applicationStrings().messages.mainHeaderStrings;
        this.props.dispatch(setCurrentHeaderTab(mainHeaderStrings.configure));
    }

    async componentDidMount() {
        this.props.dispatch(await isFBTokenExpired());
        this.props.dispatch(await twitterAuthentication());
        this.sourceTab(this.props.params, this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.sourceType !== this.props.params.sourceType) {
            this.sourceTab(nextProps.params, nextProps.dispatch);
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.params.sourceType !== this.props.params.sourceType ||
            nextProps.sourcesAuthenticationInfo.facebook !== this.props.sourcesAuthenticationInfo.facebook ||
            nextProps.sourcesAuthenticationInfo.twitter !== this.props.sourcesAuthenticationInfo.twitter;
    }

    _showFBLogin() {
        if(!this.login) {
            this.facebookLogin.login().then(expiresAfter => {
                this.props.dispatch(updateTokenExpiredInfo(expiresAfter));
                this.props.dispatch(SourceConfigActions.clearSources);
            }).catch(() => {
                this.login = false;
            });
            this.login = true;
        }
    }

    _showTwitterLogin() {
        if(!this.props.sourcesAuthenticationInfo.twitter) {
            TwitterLogin.instance().login().then((authenticated) => {
                this.props.dispatch(twitterTokenInformation(authenticated));
                this.props.dispatch(SourceConfigActions.clearSources);
            });
        }
    }

    sourceTab(params, dispatch) {
        const currentSource = params.sourceSubType || params.sourceType;
        if (R.any(source => source === currentSource)(sourceTypes)) {
            dispatch(SourceConfigActions.switchSourceTab(params.sourceSubType || params.sourceType));
        } else {
            History.getHistory().push("/configure/web");
        }
    }

    render() {
        return (
            <div className="configure-container">
                { !IS_MOBILE && <ConfiguredPane /> }
                <ConfigurePane currentSourceType={this.props.params.sourceType}
                    fbLogin={this._showFBLogin}
                    twitterLogin = {this._showTwitterLogin}
                />
            </div>);
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "sourcesAuthenticationInfo": PropTypes.object
};

const mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab,
    "sourcesAuthenticationInfo": store.sourcesAuthenticationInfo
});

export default connect(mapToStore)(ConfigureSourcesPage);
