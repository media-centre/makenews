import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { updateTokenExpiredInfo, isFBTokenExpired } from "./../../facebook/FacebookAction";
import { twitterAuthentication, twitterTokenInformation } from "./../../twitter/TwitterTokenActions";
import TwitterLogin from "./../../twitter/TwitterLogin";

export class ConfigureSourcesPage extends Component {

    constructor() {
        super();
        this.facebookLogin = FacebookLogin.instance();
        this.login = false;
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

    _showFBLogin(dispatch) {
        if(!this.login) {
            this.facebookLogin.login().then(expiresAfter => {
                dispatch(updateTokenExpiredInfo(expiresAfter));
                dispatch(SourceConfigActions.clearSources);
            }).catch(() => {
                this.login = false;
            });
            this.login = true;
        }
    }

    _showTwitterLogin(dispatch) {
        if(!this.props.sourcesAuthenticationInfo.twitter) {
            TwitterLogin.instance().login().then((authenticated) => {
                dispatch(twitterTokenInformation(authenticated));
                dispatch(SourceConfigActions.clearSources);
            });
        }
    }

    sourceTab(params, dispatch) {
        dispatch(SourceConfigActions.switchSourceTab(params.sourceSubType || params.sourceType));
    }

    render() {
        return (
            <div className="configure-container">
                <ConfiguredSources />
                <ConfigurePane currentSourceType={this.props.params.sourceType}
                    fbLogin={() => {
                        this._showFBLogin(this.props.dispatch);
                    }}
                    twitterLogin = {()=> {
                        this._showTwitterLogin(this.props.dispatch);
                    }}
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
