
import StringUtil from "../../../../common/src/util/StringUtil";
import AjaxClient from "../utils/AjaxClient";
import LoginPage from "../login/pages/LoginPage";
import FacebookLogin from "./FacebookLogin";

export default class FacebookClient {

    static instance(accessToken) {
        return new FacebookClient(accessToken);
    }
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.facebookLogin = FacebookLogin.instance();
    }

    fetchPosts(webUrl) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(webUrl)) {
                reject("web url cannot be empty");
            }
            let ajaxClient = AjaxClient.instance("/facebook-posts");
            ajaxClient.get({ "webUrl": webUrl, "userName": LoginPage.getUserName() }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    async setLongLivedToken() {
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        let ajaxClient = AjaxClient.instance("/facebook-set-token");
        let response = await ajaxClient.post(headers, { "accessToken": this.accessToken });
            // UserInfo.createOrUpdateUserDocument({ "facebookExpiredAfter": response.expires_after });
        return response.expires_after;
    }

    fetchBatchPosts(postData, skipSessionTimer) {
        return new Promise((resolve, reject)=> {
            this.facebookLogin.login().then(() => {
                postData.userName = LoginPage.getUserName();
                const headers = {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                };
                let ajaxClient = AjaxClient.instance("/facebook-batch-posts", skipSessionTimer);
                ajaxClient.post(headers, postData).then(response => { // eslint-disable-line max-nested-callbacks
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
