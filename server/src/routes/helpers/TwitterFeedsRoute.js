/* eslint consistent-this:0*/
"use strict";
import StringUtil from "../../../../common/src/util/StringUtil";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route.js";

export default class TwitterFeedsRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }

    valid() {
        if(StringUtil.isEmptyString(this.url)) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }

        let twitterRequestHandler = TwitterRequestHandler.instance();
        twitterRequestHandler.fetchTweetsRequest(this.url).then(feeds => {
            this._handleSuccess(feeds);
        }).catch(error => {
            this._handleFailure(error);
        });
    }
}

