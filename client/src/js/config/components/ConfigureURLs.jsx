/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import FacebookLogin from "../../facebook/FacebookLogin";
import { connect } from "react-redux";
import { Link } from "react-router";
import { updateTokenExpireTime } from "./../../facebook/FaceBookAction";

export class ConfigureURLs extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Configure"));

    }

    _showFBLogin() {
        console.log("in compoenent champesta print avvakapote ", this.props.FBExpiresTime.expiresTime);
        if(!this.props.FBExpiresTime.expiresTime || FacebookLogin.getCurrentTime() > this.props.FBExpiresTime.expiresTime) {
        FacebookLogin.getInstance().then(facebookInstance => {
            facebookInstance.login().then(expires_after => {
                    console.log("After facebook Login");
                    console.log("Expire after ", expires_after);
                    this.props.dispatch(updateTokenExpireTime(expires_after));//ggfhjkl
                    console.log("after dispatch function");
                    console.log(this.props.tokenExpiresTime);
                    console.log("&&&&&&&&&&&&&&&&&&&");
                }).catch(err => {
                    console.log("error in config url", err);
                });
        });
        } else {
            console.log("IN ELSE CONDITION")
        }

    }

    render() {
        return (
            <div>
                <nav className="sources-nav">
                    <Link to="/configure/web" className={this.props.params.sourceType === "web" ? "sources-nav__item active" : "sources-nav__item"}>
                        <i className="fa fa-globe" />
                        Web URLs
                    </Link>
                    <Link to="/configure/facebook/profiles" className={this.props.params.sourceType === "facebook" ? "sources-nav__item active" : "sources-nav__item"}>
                        <i className="fa fa-facebook-square" />Facebook
                    </Link>
                    <Link to="/configure/twitter" className={this.props.params.sourceType === "twitter" ? "sources-nav__item active" : "sources-nav__item"}>
                        <i className="fa fa-twitter" />Twitter
                    </Link>
                </nav>
                <div className="next-button" onClick={() => this._showFBLogin()}>{"Next"}</div>
                { this.props.children }
            </div>
        );
    }
}

ConfigureURLs.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node.isRequired,
    "params": PropTypes.object.isRequired,
    "FBExpiresTime": PropTypes.object
};

function select(store) {
    console.log("In store vlues")
    console.log(store.FBExpiresTime.expiresTime);
    console.log(store)
    console.log("%%%%%%%%%%%%%%%%%%%%")
    return store;
}

export default connect(select)(ConfigureURLs);
