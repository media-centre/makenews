"use strict";
import CouchSession from "../../CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import BoolUtil from "../../../../common/src/util/BoolUtil.js";

export default class LoginRouteHelper {
    static loginCallback(request, response) {

        if(BoolUtil.isEmpty(request) || BoolUtil.isEmpty(response)) {
            throw new Error("request or response can not be empty");
        }

        if(LoginRouteHelper.isValidUserInput(request.body.username, request.body.password)) {
            LoginRouteHelper.handleInvalidInput(response);
        } else {
            CouchSession.login(request.body.username, request.body.password)
                .then((token) => {
                    LoginRouteHelper.handleLoginSuccess(response, token);
                })
                .catch(() => {
                    LoginRouteHelper.handleLoginFailure(response);
                });
        }
    }

    static handleLoginSuccess(response, token) {
        response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", token)
            .json({ "message": "login successful" });
    }

    static handleLoginFailure(response) {
        response.status(HttpResponseHandler.codes.UNAUTHORIZED)
            .json({ "message": "unauthorized" });
    }

    static handleInvalidInput(response) {
        response.status(HttpResponseHandler.codes.UNAUTHORIZED)
            .json({ "message": "invalid user or password" });
    }

    static isValidUserInput(userName, password) {
        if(StringUtil.trim(userName) === "" || StringUtil.trim(password) === "") {
            return true;
        }
        return false;
    }

}
