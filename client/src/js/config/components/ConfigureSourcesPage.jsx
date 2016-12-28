import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { PAGES, PROFILES, GROUPS } from "./../actions/FacebookConfigureActions";
import { updateTokenExpireTime, getTokenExpireTime } from "./../../facebook/FacebookAction";

export class ConfigureSourcesPage extends Component {

    componentDidMount() {
        this.sourceTab(this.props.params, this.props.dispatch);
        this.props.dispatch(getTokenExpireTime());
        
        /* TODO: Move FacebookLogin Instance to Facebook Related Conditions*/ //eslint-disable-line no-warning-comments,no-inline-comments
        this.facebookLogin = FacebookLogin.instance();
    }

    componentWillReceiveProps(nextProps) {
        this.sourceTab(nextProps.params, nextProps.dispatch);
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

    sourceTab(params, dispatch) {
        dispatch(SourceConfigActions.clearSources());
        switch (params.sourceType) {
        case "twitter": {
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.TWITTER));
            break;
        }
        case "facebook": {
            this._showFBLogin();
            if(params.sourceSubType === "groups") {
                dispatch(SourceConfigActions.switchSourceTab(GROUPS));
            } else if(params.sourceSubType === "pages") {
                dispatch(SourceConfigActions.switchSourceTab(PAGES));
            } else {
                dispatch(SourceConfigActions.switchSourceTab(PROFILES));
            }
            break;
        }
        case "web":
        default: {
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.WEB));
        }
        }
    }

    render() {
        let sourceType = this.props.params.sourceType;
        let ZERO = 0;
        let fbTokenExpired = sourceType === "facebook" && this.props.expireTime === ZERO;
        return (fbTokenExpired ? <div className="configure-container">{ "Please login to facebook" }</div>
            : <div className="configure-container"><ConfiguredSources /><ConfigurePane /></div>);
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "expireTime": PropTypes.number
};

let mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab,
    "expireTime": store.tokenExpiresTime.expireTime
});

export default connect(mapToStore)(ConfigureSourcesPage);
