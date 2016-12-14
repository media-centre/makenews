/* eslint react/jsx-wrap-multilines:0*/
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import UserSession from "../user/UserSession";
import AppWindow from "../utils/AppWindow";
import fetch from "isomorphic-fetch";

export default class AjaxClient {
    static instance(url, skipTimer) {
        return new AjaxClient(url, skipTimer);
    }

    constructor(url, skipTimer) {
        if (!skipTimer) {
            UserSession.instance().continueSessionIfActive();
        }
        this.url = AppWindow.instance().get("serverUrl") + url;
    }

    async post(headers, data) {
        return await this.request({
            "method": "POST",
            "credentials": "same-origin",
            "headers": headers,
            "body": JSON.stringify(data)
        });
    }

    async get(queryParams = {}) {
        let keys = Object.keys(queryParams);
        if (keys.length !== 0) { //eslint-disable-line no-magic-numbers
            this.url = this.url + "?";
            let keyValues = keys.map(queryKey => {
                return queryKey + "=" + encodeURIComponent(queryParams[queryKey]);
            });
            this.url = this.url + keyValues.join("&");
        }
        return await this.request({
            "method": "GET",
            "credentials": "same-origin"
        });
    }

    async request(params) {  //eslint-disable-line consistent-return
        let response = await fetch(this.url, params);

        let responseJson = await response.json();

        if (response.status === this.responseCodes().OK) {
            return responseJson;
        } else if(response.status === this.responseCodes().UNAUTHORIZED) {
            if (responseJson.message === "session expired") { //eslint-disable-line max-depth
                UserSession.instance().autoLogout();
            }
            throw responseJson;
        } else if (response.status === this.responseCodes().BAD_GATEWAY) {
            throw "connection refused"; //eslint-disable-line no-throw-literal
        }
        throw responseJson;
    }

    responseCodes() {
        return {
            "BAD_GATEWAY": HttpResponseHandler.codes.BAD_GATEWAY,
            "REQUEST_FINISHED": 4,
            "OK": HttpResponseHandler.codes.OK,
            "UNAUTHORIZED": HttpResponseHandler.codes.UNAUTHORIZED
        };
    }
}
