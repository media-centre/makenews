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

    async componentDidMount() {
        this.props.dispatch(await getTokenExpireTime());
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
            nextProps.expireTime !== this.props.expireTime ||
            nextProps.twitterAuthenticated !== this.props.twitterAuthenticated;
    }

    _showFBLogin(dispatch) {
        this.facebookLogin.login().then(expiresAfter => {
            this.isPopUpDisplayed = false;
            dispatch(updateTokenExpireTime(expiresAfter));
        });
    }

    _showTwitterLogin(dispatch) {
        if(!this.props.twitterAuthenticated) {
            TwitterLogin.instance().login().then((authenticated) => {
                this.isPopUpDisplayed = false;
                dispatch(twitterTokenInformation(authenticated));
            });
        }
    }

    showLoginPrompt(sourceType, dispatch) {
        if(sourceType === "facebook" && new Date().getTime() > this.props.expireTime) {
            this.isPopUpDisplayed = true;
            this._showFBLogin(dispatch);
        } else if (sourceType === "twitter" && this.props.twitterAuthenticated === false) {
            this.isPopUpDisplayed = true;
            this._showTwitterLogin(dispatch);
        } else {
            this.isPopUpDisplayed = false;
        }
    }

    sourceTab(params, dispatch) {
        dispatch(SourceConfigActions.clearSources);
        this.showLoginPrompt(params.sourceType, dispatch);
        dispatch(SourceConfigActions.switchSourceTab(params.sourceSubType || params.sourceType));
        dispatch(SourceConfigActions.getSources(params.sourceSubType || params.sourceType));
    }

    render() {
        let sourceType = this.props.params.sourceType;
        return (this.isPopUpDisplayed ? <div className="configure-container">{`Please login to ${sourceType}`}</div>
            : <div className="configure-container"><ConfiguredSources /><ConfigurePane currentSourceType={this.props.params.sourceType}/></div>);
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "expireTime": PropTypes.number,
    "twitterAuthenticated": PropTypes.bool
};

const mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab,
    "expireTime": store.tokenExpiresTime.expireTime,
    "twitterAuthenticated": store.twitterTokenInfo.twitterAuthenticated
});

export default connect(mapToStore)(ConfigureSourcesPage);
