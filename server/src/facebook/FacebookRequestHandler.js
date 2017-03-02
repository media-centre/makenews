import StringUtil from "../../../common/src/util/StringUtil";
import FacebookClient from "./FacebookClient";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import Logger from "../logging/Logger";
import { getUserDocumentId, getAdminDBInstance, FACEBOOK_DOCUMENT_ID } from "../facebook/FacebookTokenDocument";
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

    async fetchFeeds(sourceId, type, options = {}) {
        let facebookClientInstance = this.facebookClient();
        try {
            let feeds = await facebookClientInstance.fetchFeeds(sourceId, type, this._getAllOptions(options));
            FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched feeds for url: %s.", sourceId);
            return feeds;
        } catch (error) {
            FacebookRequestHandler.logger().error("FacebookRequestHandler:: error fetching facebook id of web url = %s. Error: %s", sourceId, error);
            let err = "error fetching facebook feeds of web url = " + sourceId;
            throw (err);
        }
    }

    async saveToken(dbInstance, tokenDocumentId, document) {
        try {
            await dbInstance.saveDocument(tokenDocumentId, document);
            FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully saved facebook token.");
            return document.expired_after;
        } catch (error) {
            FacebookRequestHandler.logger().error("FacebookRequestHandler:: error while saving facebook long lived token. Error: %s", error);
            throw new Error("error while saving facebook long lived token.");
        }
    }

    async setToken(authSession) {
        let facebookClientInstance = FacebookClient.instance(this.accessToken, this.appSecretKey(), this.appId());
        let currentTime = DateUtil.getCurrentTime();
        try {
            let longLivedToken = await facebookClientInstance.getLongLivedToken();
            const milliSeconds = 1000;
            longLivedToken.expired_after = currentTime + (longLivedToken.expires_in * milliSeconds); //eslint-disable-line camelcase
            FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched long lived token from facebook.");
            let adminDbInstance = await getAdminDBInstance();
            let tokenDocumentId = await getUserDocumentId(authSession, FACEBOOK_DOCUMENT_ID);
            try {
                let document = await adminDbInstance.getDocument(tokenDocumentId);
                FacebookRequestHandler.logger().debug("FacebookRequestHandler:: successfully fetched existing long lived token from db.");
                document.access_token = longLivedToken.access_token; //eslint-disable-line camelcase
                document.token_type = longLivedToken.token_type; //eslint-disable-line camelcase
                document.expires_in = longLivedToken.expires_in; //eslint-disable-line camelcase
                document.expired_after = longLivedToken.expired_after; //eslint-disable-line camelcase
                return await this.saveToken(adminDbInstance, tokenDocumentId, document);
            } catch(err) {
                FacebookRequestHandler.logger().debug("FacebookRequestHandler:: creating facebook token document.");
                return await this.saveToken(adminDbInstance, tokenDocumentId, longLivedToken);
            }
        } catch(error) {
            throw new Error(`error getting long lived token with token ${this.accessToken}`);
        }
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
            vars.forEach(param => {
                let pair = param.split("=");
                queryParams[pair[0]] = pair[1]; // eslint-disable-line no-magic-numbers
            });
        }
        delete queryParams.access_token;
        delete queryParams.fields;
        return queryParams;
    }

    async fetchSourceUrls(params, paging = {}) {
        const facebookClientInstance = this.facebookClient();
        try {
            const sources = await facebookClientInstance.fetchSourceUrls(params, paging);
            FacebookRequestHandler.logger().debug(`FacebookRequestHandler:: successfully fetched ${params.type}s for ${params.q}.`);
            let pagingResponse = {};
            if(params.type === "user") {
                pagingResponse.paging = this._getPagingParams(sources.paging);
            } else {
                pagingResponse.paging = sources.paging ? { "after": sources.paging.cursors.after } : {};
            }
            return R.assoc("data", sources.data, pagingResponse);
        } catch(error) {
            FacebookRequestHandler.logger().error(`FacebookRequestHandler:: error fetching facebook ${params.type}s. Error: ${JSON.stringify(error)}`);
            throw `error fetching facebook ${params.type}s`;  // eslint-disable-line no-throw-literal
        }
    }

    _getAllOptions(userOptions) {
        let allOptions = userOptions ? userOptions : {};
        allOptions.fields = "link,message,picture,full_picture,name,caption,place,privacy,created_time,from";
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
