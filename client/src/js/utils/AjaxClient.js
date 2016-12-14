/* eslint react/jsx-wrap-multilines:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
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
        return await this.request("POST", headers, data);
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
        return await this.request("GET");
    }

    async request(method, headers = {}, data = {}) {
        let response = await fetch(this.url, {
            "method": method,
            "credentials": "same-origin",
            "headers": headers,
            "body": JSON.stringify(data)
        });

        let responseJson = await response.json();

        if (response.status === this.responseCodes().OK) {
            return responseJson;
        }
        throw responseJson;
    }

    setRequestHeaders(xhttp, userHeaders) {
        for (let key in userHeaders) {
            if (StringUtil.validNonEmptyString(key) && StringUtil.validString(userHeaders[key])) {
                xhttp.setRequestHeader(key.trim(), userHeaders[key].trim());
            }
        }
    }

    responsePromise(xhttp) {
        return new Promise((resolve, reject) => {
            let response = this.responseCodes();
            xhttp.onreadystatechange = function (event) {
                if (xhttp.readyState === response.REQUEST_FINISHED) {
                    if (xhttp.status === response.OK) {
                        let jsonResponse = JSON.parse(event.target.response);
                        resolve(jsonResponse);
                    } else if (xhttp.status === response.UNAUTHORIZED) {
                        let jsonResponse = event.target.response;
                        try {
                            jsonResponse = JSON.parse(event.target.response);
                            if (jsonResponse.message === "session expired") { //eslint-disable-line max-depth
                                UserSession.instance().autoLogout();
                            }
                        } catch (error) {
                            reject(jsonResponse);
                        }
                        reject(jsonResponse);
                    } else if (xhttp.status === response.BAD_GATEWAY) {
                        reject("connection refused");
                    }
                    reject(event.target.response);
                }
            };
        });
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
