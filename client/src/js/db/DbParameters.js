"use strict";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import AjaxClient from "../../js/utils/AjaxClient";

export default class DbParameters {

    static instance() {
        return new DbParameters();
    }
    constructor() {
        this.appSession = AppSessionStorage.instance();
    }

    getLocalDbUrl() {
        return new Promise((resolve, reject) => {
            let localDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.USERNAME);
            console.log(localDbUrl);
            if (StringUtil.isEmptyString(localDbUrl)) {
                reject("local db url can not be empty");
            }
            let ajaxClient = AjaxClient.instance("/user_db/" + localDbUrl);
            ajaxClient.get().then(response => {
                this.userDb = response.hash;
                resolve(response.hash);
            });
        });
    }

    getRemoteDbUrl() {
        return new Promise((resolve, reject) => {
            let remoteDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.REMOTEDBURL);
            if(StringUtil.isEmptyString(remoteDbUrl)) {
                reject("remote db url can not be empty");
            }
            this.getLocalDbUrl().then(response => {
                resolve(remoteDbUrl + "/" + response);
            });
        });
    }
}
