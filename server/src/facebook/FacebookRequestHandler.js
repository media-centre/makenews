import StringUtil from "../../../common/src/util/StringUtil";
import FacebookClient from "./FacebookClient";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";
import R from "ramda"; //eslint-disable-line id-length

export default class FacebookRequestHandler {

    static instance(accessToken) {
        return new FacebookRequestHandler(accessToken);
    }

    static logger() {
        return Logger.instance("Facebook");
    }

    constructor(accessToken) {
        if(StringUtil.isEmptyString(accessToken)) {
            throw new Error("access token can not be empty");
        }
        this.accessToken = accessToken;
    }

    async pagePosts(webUrl, type, options = {}) {
        let facebookClientInstance = this.facebookClient();
        try {
            let pageId = await facebookClientInstance.getFacebookId(webUrl);
            let feeds = await facebookClientInstance.pagePosts(pageId, type, this._getAllOptions(options));
            FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched feeds for url: %s.", webUrl);
            return feeds;

        } catch (error) {
            FacebookRequestHandler.logger().error("FacebookRequestHandler:: error fetching facebook id of web url = %s. Error: %s", webUrl, error);
            let err = "error fetching facebook feeds of web url = " + webUrl;
            throw (err);
        }

    }

    saveToken(dbInstance, tokenDocumentId, document, resolve, reject) {
        dbInstance.saveDocument(tokenDocumentId, document).then(() => {
            FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully saved facebook token.");
            resolve(document.expired_after);
        }).catch(error => {
            FacebookRequestHandler.logger().error("FacebookRequestHandler:: error while saving facebook long lived token. Error: %s", error);
            reject("error while saving facebook long lived token.");
        });
    }

    setToken(userName) {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = FacebookClient.instance(this.accessToken, this.appSecretKey(), this.appId());
            let currentTime = DateUtil.getCurrentTime();
            facebookClientInstance.getLongLivedToken().then(response => {
                const milliSeconds = 1000;
                response.expired_after = currentTime + (response.expires_in * milliSeconds); //eslint-disable-line camelcase
                FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched long lived token from facebook.");
                const adminDetails = ApplicationConfig.instance().adminDetails();
                AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then((dbInstance) => {
                    let tokenDocumentId = userName + "_facebookToken";
                    dbInstance.getDocument(tokenDocumentId).then((document) => { //eslint-disable-line max-nested-callbacks
                        FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched existing long lived token from db.");
                        document.access_token = response.access_token; //eslint-disable-line camelcase
                        document.token_type = response.token_type; //eslint-disable-line camelcase
                        document.expires_in = response.expires_in; //eslint-disable-line camelcase
                        document.expired_after = response.expired_after; //eslint-disable-line camelcase
                        this.saveToken(dbInstance, tokenDocumentId, document, resolve, reject);
                    }).catch(() => { //eslint-disable-line max-nested-callbacks
                        FacebookRequestHandler.logger().debug("FacebookRequestHandler:: creating facebook token document.");
                        this.saveToken(dbInstance, tokenDocumentId, response, resolve, reject);
                    });
                });
            }).catch(error => {
                FacebookRequestHandler.logger().error("FacebookRequestHandler:: error getting long lived token. Error: %s", error);
                reject("error getting long lived token with token " + this.accessToken);
            });
        });
    }
    
    fetchProfiles() {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = this.facebookClient();
            facebookClientInstance.fetchProfiles().then(profiles => {
                FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched Profiles.");
                resolve(profiles.data);
            }).catch(error => {
                FacebookRequestHandler.logger().error(`FacebookRequestHandler:: error fetching facebook profiles. Error: ${error}`);
                reject("error fetching facebook profiles");
            });
        });
    }

    _getPagingParams(path) {
        let queryParams = { };
        
        if(path && path.next) {
            let queryStrings = path.next.split("?")[1]; // eslint-disable-line no-magic-numbers
            let vars = queryStrings.split("&");
            for (let param of vars) {
                let pair = param.split("=");
                queryParams[pair[0]] = pair[1]; // eslint-disable-line no-magic-numbers
            }
        }
        delete queryParams.access_token;
        delete queryParams.fields;
        return queryParams;
    }

    async fetchSourceUrls(params, paging = {}) {
        let facebookClientInstance = this.facebookClient();
        try {
            let sources = await facebookClientInstance.fetchSourceUrls(params, paging);
            FacebookRequestHandler.logger().debug(`FacebookRequestHandler:: successfully fetched ${params.type}s for ${params.q}.`);
            return R.assoc("data", sources.data, { "paging": this._getPagingParams(sources.paging) });
        } catch(error) {
            FacebookRequestHandler.logger().error(`FacebookRequestHandler:: error fetching facebook ${params.type}s. Error: ${error}`);
            throw `error fetching facebook ${params.type}s`;  // eslint-disable-line no-throw-literal
        }
    }

    _getAllOptions(userOptions) {
        let allOptions = userOptions ? userOptions : {};
        allOptions.fields = "link,message,picture,name,caption,place,privacy,created_time";
        allOptions.limit = 100;
        return allOptions;
    }

    facebookClient() {
        let appSecretProof = this.appSecretProof();
        let appId = this.appId();
        return FacebookClient.instance(this.accessToken, appSecretProof, appId);
    }

    appSecretProof() {
        return CryptUtil.hmac("sha256", this.appSecretKey(), "hex", this.accessToken);
    }

    appSecretKey() {
        return ApplicationConfig.instance().facebook().appSecretKey;
    }

    appId() {
        return ApplicationConfig.instance().facebook().appId;
    }
}
