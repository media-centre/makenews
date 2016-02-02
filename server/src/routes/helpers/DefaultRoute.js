/* eslint no-unused-vars:0 */
"use strict";
import CouchSession from "../../CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Route from "./Route.js";

export default class DefaultRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = request.originalUrl;
        this.authSessionCookie = request.cookies.AuthSession;
    }

    handle() {
        if(this.whiteList(this.url)) {
            return this.next();
        } else if(this.authSessionCookie) {
            CouchSession.authenticate(this.authSessionCookie)
                .then(() => {
                    this.next();
                }).catch(() => {
                    this._handleFailure();
                });
        } else {
            this._handleFailure();
        }
    }

    _handleFailure() {
        let error = new Error("unthorized");
        error.status = HttpResponseHandler.codes.UNAUTHORIZED;
        this.next(error);
    }

    whiteList() {
        if(!this.url) {
            throw new Error("url can not be empty");
        }

        let whitelistUrls = [/^\/$/g, /^\/login$/g, /^\/renew_session$/g, /^\/app-min.js$/g, /^\/app.css$/g, /^\/images\/.*/g, /^\/fonts\/.*/g, /^\/config\/.*\.js$/];
        return whitelistUrls.filter((item) => {
            return this.url.match(item);
        }).length > 0;
    }
}

