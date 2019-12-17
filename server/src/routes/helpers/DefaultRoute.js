import CouchSession from "../../CouchSession";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import Route from "./Route";
import StringUtil from "../../../../common/src/util/StringUtil";

export default class DefaultRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = request.originalUrl;
        this.authSessionCookie = request.cookies.AuthSession;
    }

    valid() {
        return !StringUtil.isEmptyString(this.url);
    }

    handle() { //eslint-disable-line consistent-return
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }

        if(this.isWhitelistUrl()) {
            return this.next();
        } else if(this.authSessionCookie) {
            CouchSession.authenticate(this.authSessionCookie)
                .then((token) => {
                    this.request.cookies.AuthSession = token;
                    this.next();
                }).catch(() => {
                    this._handleFailure();
                });
        } else {
            this._handleFailure();
        }
    }

    _handleFailure() {
        const error = {};
        error.status = HttpResponseHandler.codes.UNAUTHORIZED;
        error.message = "session expired";
        this.next(error);
    }

    isWhitelistUrl() {
        if(!this.url) {
            throw new Error("url can not be empty");
        }

        const whitelistUrls = [/^\/$/g, /^\/login$/g, /^\/renew_session$/g, /^\/user_db/g, /^\/app-min.js$/g, /^\/app.css$/g, /^\/images\/.*/g, /^\/fonts\/.*/g, /^\/config\/.*\.js$/];
        return whitelistUrls.filter((item) => {
            return this.url.match(item);
        }).length > 0; //eslint-disable-line no-magic-numbers
    }
}

