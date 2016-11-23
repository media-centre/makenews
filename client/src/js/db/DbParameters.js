
import AppSessionStorage from "../utils/AppSessionStorage";
import StringUtil from "../../../../common/src/util/StringUtil";
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
            if(this.userDb) {
                resolve(this.userDb);
            } else {
                let localDbUrl = this.appSession.getValue(AppSessionStorage.KEYS.USERNAME);
                if (StringUtil.isEmptyString(localDbUrl)) {
                    reject("local db url can not be empty");
                }
                let ajaxClient = AjaxClient.instance("/user_db/" + localDbUrl);
                ajaxClient.get().then(response => {
                    this.userDb = response.dbName;
                    resolve(response.dbName);
                });
            }
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
