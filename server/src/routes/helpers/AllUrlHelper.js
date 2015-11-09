"use strict";
import CouchSession from "../../CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import BoolUtil from "../../../../common/src/util/BoolUtil.js";

export default class AllUrlHelper {
    static allUrlsCallback(request, next) {
        if(AllUrlHelper.whiteList(request.originalUrl)) {
            return next();
        } else if(request.cookies.AuthSession) {
            CouchSession.authenitcate(request.cookies.AuthSession)
                .then((userName) => {
                    next();
                }).catch((error) => {
                    proceedToUnAuthorizedError();
                });
        } else {
            proceedToUnAuthorizedError();
        }
        function proceedToUnAuthorizedError() {
            let error = new Error("unthorized");
            error.status = HttpResponseHandler.codes.UNAUTHORIZED;
            next(error);
        }
    }

    static whiteList(url) {
        if(BoolUtil.isEmpty(url)) {
            throw new Error("url can not be empty");
        }

        let whitelistUrls = ["/", "/login", "/app.js", "/app.css", "/images/newspaper.jpg"];
        const negativeIndex = -1;
        if(whitelistUrls.indexOf(url) !== negativeIndex) {
            return true;
        }
        return false;
    }
}
