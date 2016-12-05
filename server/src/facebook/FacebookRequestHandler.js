import StringUtil from "../../../common/src/util/StringUtil";
import FacebookClient from "./FacebookClient";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";
import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { sourceTypes } from "../util/Constants";

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

    pagePosts(webUrl, options = {}) {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = this.facebookClient();
            facebookClientInstance.getFacebookId(webUrl).then(pageId => {
                facebookClientInstance.pagePosts(pageId, this._getAllOptions(options)).then(feeds => {
                    FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched feeds for url: %s.", webUrl);
                    resolve(feeds.data);
                }).catch(error => {
                    FacebookRequestHandler.logger().error("FacebookRequestHandler:: error fetching facebook feeds of web url = %s. Error: %j", webUrl, error);
                    reject("error fetching facebook feeds of web url = " + webUrl);
                });
            }).catch(error => {
                FacebookRequestHandler.logger().error("FacebookRequestHandler:: error fetching facebook id of web url = %s. Error: %s", webUrl, error);
                reject("error fetching facebook feeds of web url = " + webUrl);
            });
        });
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

    async fetchSourceUrls(keyword, type) {
        let facebookClientInstance = this.facebookClient();
        try {
            let sources = await facebookClientInstance.fetchSourceUrls(keyword, type);
            FacebookRequestHandler.logger().debug(`FacebookRequestHandler:: successfully fetched ${type}s for ${keyword}.`);
            return sources;
        } catch(error) {
            FacebookRequestHandler.logger().error(`FacebookRequestHandler:: error fetching facebook ${type}s. Error: ${error}`);
            throw `error fetching facebook ${type}s`;  // eslint-disable-line no-throw-literal
        }
    }

    async fetchConfiguredSources(authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        let data = await couchClient.findDocuments({
            "selector": {
                "docType": {
                    "$eq": "configuredSource"
                }
            }
        });
        return this.formatConfiguredSources(data.docs);
    }

    /* TODO change it to one time traversal */ //eslint-disable-line
    formatConfiguredSources(docs) {
        let result = {
            "profiles": [], "pages": [], "groups": [], "twitter": [], "web": []
        };
        result.profiles = R.filter(R.propEq("sourceType", sourceTypes.fb_profile), docs);
        result.pages = R.filter(R.propEq("sourceType", sourceTypes.fb_page), docs);
        result.groups = R.filter(R.propEq("sourceType", sourceTypes.fb_group), docs);
        result.twitter = R.filter(R.propEq("sourceType", "twitter"), docs);
        result.web = R.filter(R.propEq("sourceType", "web"), docs);

        return result;
    }

    async addConfiguredSource(sourceType, source, authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        try {
            await couchClient.saveDocument(source.url, {
                "_id": source.url,
                "name": source.name,
                "docType": "configuredSource",
                "sourceType": sourceType,
                "latestFeedTimeStamp": DateUtil.getCurrentTime()
            });
            return { "ok": true };
        } catch (error) {
            FacebookRequestHandler.logger().error(`FacebookRequestHandler:: error added source. Error: ${error}`);
            throw error;
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
