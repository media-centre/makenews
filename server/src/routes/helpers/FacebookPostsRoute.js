/* eslint consistent-this:0*/
"use strict";
import moment from "moment";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../facebook/FacebookAccessToken.js";
import Route from "./Route.js";

export default class FacebookPostsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.webUrl = this.request.query.webUrl;
        this.since = this.request.query.since;
        this.userName = this.request.query.userName;
        this.options = {};
        if(this.since) {
            this.options.since = moment(this.since).toISOString();
        }
    }

    valid() {
        if(StringUtil.isEmptyString(this.webUrl) || StringUtil.isEmptyString(this.userName) || (this.since && !moment(this.since).isValid())) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }
        FacebookAccessToken.instance().getAccessToken(this.userName).then((token) => {
            FacebookRequestHandler.instance(token).pagePosts(this.webUrl, this.options).then(feeds => {
                this._handleSuccess({ "posts": feeds });
            }).catch(error => { //eslint-disable-line
                this._handleBadRequest();
            });
        }).catch(error => { //eslint-disable-line
            this._handleBadRequest();
        });
    }
}
