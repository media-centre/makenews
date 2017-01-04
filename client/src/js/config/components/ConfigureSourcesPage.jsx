import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { updateTokenExpireTime, getTokenExpireTime } from "./../../facebook/FacebookAction";
import { twitterAuthentication, twitterTokenInformation } from "./../../twitter/TwitterTokenActions";
import TwitterLogin from "./../../twitter/TwitterLogin";

export class ConfigureSourcesPage extends Component {

    constructor() {
        super();
        this.facebookLogin = FacebookLogin.instance();
    }

    componentDidMount() {
        this.sourceTab(this.props.params, this.props.dispatch);
        this.props.dispatch(getTokenExpireTime());
        this.props.dispatch(twitterAuthentication());
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.sourceType !== this.props.params.sourceType) {
            this.sourceTab(nextProps.params, nextProps.dispatch);
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.params.sourceType !== this.props.params.sourceType ||
            nextProps.expireTime !== this.props.expireTime ||
            nextProps.twitterAuthenticated !== this.props.twitterAuthenticated;
    }

    _showFBLogin() {
        if (FacebookLogin.getCurrentTime() > this.props.expireTime) {
            this.facebookLogin.login().then(expiresAfter => {
                this.props.dispatch(updateTokenExpireTime(expiresAfter));
            });
        }

    }
    _showTwitterLogin() {
        if(!this.props.twitterAuthenticated) {
            TwitterLogin.instance().login().then((authenticated) => {
                this.props.dispatch(twitterTokenInformation(authenticated));
            });
        }
    }

    showLoginPrompt(sourceType) {
        if(sourceType === "facebook" && new Date().getTime() > this.props.expireTime) {
            return this._showFBLogin;
        } else if (sourceType === "twitter" && !this.props.twitterAuthenticated) {
            return this._showTwitterLogin;
        }
        return null;
    }

    sourceTab(params, dispatch) {
        dispatch(SourceConfigActions.clearSources());
        let loginFunc = this.showLoginPrompt();
        if(loginFunc) {
            loginFunc();
        }
        dispatch(SourceConfigActions.switchSourceTab(params.sourceSubType || params.sourceType));
    }

    render() {
        let sourceType = this.props.params.sourceType;
        return (this.showLoginPrompt(sourceType) ? <div className="configure-container">{`Please login to ${sourceType}`}</div>
            : <div className="configure-container"><ConfiguredSources /><ConfigurePane /></div>);
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "expireTime": PropTypes.number,
    "twitterAuthenticated": PropTypes.bool
};

let mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab,
    "expireTime": store.tokenExpiresTime.expireTime,
    "twitterAuthenticated": store.twitterTokenInfo.twitterAuthenticated
});

export default connect(mapToStore)(ConfigureSourcesPage);
