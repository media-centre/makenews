import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { PAGES, PROFILES, GROUPS } from "./../actions/FacebookConfigureActions";
import { updateTokenExpireTime, getTokenExpireTime } from "./../../facebook/FacebookAction";
import { twitterAuthentication, twitterTokenInformation } from "./../../twitter/TwitterTokenActions";
import TwitterLogin from "./../../twitter/TwitterLogin";

export class ConfigureSourcesPage extends Component {

    componentDidMount() {
        this.sourceTab(this.props.params, this.props.keyword, this.props.dispatch);
        this.props.dispatch(getTokenExpireTime());
        this.props.dispatch(twitterAuthentication());

        /* TODO: Move FacebookLogin Instance to Facebook Related Conditions*/ //eslint-disable-line no-warning-comments,no-inline-comments
        this.facebookLogin = FacebookLogin.instance();
    }

    componentWillReceiveProps(nextProps) {
        this.sourceTab(nextProps.params, nextProps.keyword, nextProps.dispatch);
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.params.sourceType !== this.props.params.sourceType) ||
            (nextProps.expireTime !== this.props.expireTime);
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

    sourceTab(params, keyword, dispatch) {
        dispatch(SourceConfigActions.clearSources());
        switch (params.sourceType) {
        case "twitter": {
            this._showTwitterLogin();
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.TWITTER));
            break;
        }
        case "facebook": {
            this._showFBLogin();
            if(params.sourceSubType === "groups") {
                dispatch(SourceConfigActions.switchSourceTab(GROUPS));
                dispatch(SourceConfigActions.getSources(GROUPS, keyword));
            } else if(params.sourceSubType === "pages") {
                dispatch(SourceConfigActions.switchSourceTab(PAGES));
                dispatch(SourceConfigActions.getSources(PAGES, keyword));
            } else {
                dispatch(SourceConfigActions.switchSourceTab(PROFILES));
                dispatch(SourceConfigActions.getSources(PROFILES, keyword));
            }
            break;
        }
        case "web":
        default: {
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.WEB));
        }
        }
    }

    getSourceType() {
        let sourceType = this.props.params.sourceType;
        let ZERO = 0;
        let fbTokenExpired = sourceType === "facebook" && this.props.expireTime === ZERO;
        let twitterExpired = sourceType === "twitter" && !this.props.twitterAuthenticated;
        if(fbTokenExpired) {
            return "facebook";
        } else if(twitterExpired) {
            return "twitter";
        }
        return false;
    }

    render() {
        let sourceType = this.getSourceType();
        return (sourceType ? <div className="configure-container">{`Please login to ${sourceType}`}</div>
            : <div className="configure-container"><ConfiguredSources /><ConfigurePane /></div>);
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "expireTime": PropTypes.number,
    "keyword": PropTypes.string,
    "twitterAuthenticated": PropTypes.bool
};

let mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab,
    "expireTime": store.tokenExpiresTime.expireTime,
    "keyword": store.sourceSearchKeyword,
    "twitterAuthenticated": store.twitterTokenInfo.twitterAuthenticated
});

export default connect(mapToStore)(ConfigureSourcesPage);
