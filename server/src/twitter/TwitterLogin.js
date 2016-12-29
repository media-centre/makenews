import ApplicationConfig from "../../src/config/ApplicationConfig";
import { getUserDocumentId, getAdminDBInstance } from "../facebook/FacebookTokenDocument";
import { TWITTER_DOCUMENT_ID } from "./TwitterToken";
import Logger from "../logging/Logger";
import OAuth from "oauth";

let oauthTokenMap = {};
export default class TwitterLogin {
    constructor(oauthToken, oauthTokenSecret, clientCallbackUrl, accessToken) {
        this.oauthToken = oauthToken;
        this.oauthTokenSecret = oauthTokenSecret;
        this.clientCallbackUrl = clientCallbackUrl;
        this.oauth = TwitterLogin.createOAuthInstance();
        this.accessToken = accessToken;
    }

    static logger() {
        return Logger.instance();
    }

    static instance(options = {}) {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            if(options.previouslyFetchedOauthToken) {
                TwitterLogin.logger().debug("TwitterLogin:: returning existing twitter login instance with auth token");
                let tokenInfo = oauthTokenMap[options.previouslyFetchedOauthToken];
                let twitterInstance = new TwitterLogin(options.previouslyFetchedOauthToken, tokenInfo.oauthTokenSecret, tokenInfo.clientCallbackUrl, options.accessToken);
                resolve(twitterInstance);
            } else {
                new TwitterLogin()._requestTokenFromTwitter(options.serverCallbackUrl).then(instance => {
                    TwitterLogin.logger().debug("TwitterLogin:: creating twitter login instance.");
                    oauthTokenMap[instance.oauthToken] = { "oauthTokenSecret": instance.oauthTokenSecret, "clientCallbackUrl": options.clientCallbackUrl };
                    resolve(instance);
                });
            }
        });
    }

    static createOAuthInstance() {
        return new OAuth.OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            ApplicationConfig.instance().twitter().consumerKey,
            ApplicationConfig.instance().twitter().consumerSecret,
            "1.0A",
            null,
            "HMAC-SHA1"
        );
    }

    _requestTokenFromTwitter(serverCallbackUrl) {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthRequestToken({ "oauth_callback": serverCallbackUrl }, (error, oauthToken, oauthTokenSecret, results) => { //eslint-disable-line no-unused-vars
                if (error) {
                    TwitterLogin.logger().error("TwitterLogin:: getting request token from twitter failed. Error: %j", error);
                    reject(error);
                }
                this.oauthToken = oauthToken;
                this.oauthTokenSecret = oauthTokenSecret;
                TwitterLogin.logger().debug("TwitterLogin:: getting request token from twitter successful.");
                resolve(this);
            });
        });
    }

    accessTokenFromTwitter(oauthVerifier) {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            this.oauth.getOAuthAccessToken(this.oauthToken, this.oauthTokenSecret, oauthVerifier, (error, oauthAccessToken, oauthAccessTokenSecret) => {
                this.saveToken(oauthAccessToken, oauthAccessTokenSecret).then(() => {
                    TwitterLogin.logger().debug("TwitterLogin:: getting access token from twitter successful.");
                    resolve(this.clientCallbackUrl);
                });
            });
        });
    }
    
    async saveToken(oauthAccessToken, oauthAccessTokenSecret) {
        let tokenDocumentId = await getUserDocumentId(this.accessToken, TWITTER_DOCUMENT_ID);
        let document = {
            "oauthAccessToken": oauthAccessToken,
            "oauthAccessTokenSecret": oauthAccessTokenSecret
        };
        let adminDbInstance = await getAdminDBInstance();
        try {
            let tokenDocument = await adminDbInstance.getDocument(tokenDocumentId);
            TwitterLogin.logger().debug("TwitterLogin:: successfully fetched existing twitter token from db.");
            await adminDbInstance.saveDocument(tokenDocumentId, Object.assign({}, tokenDocument, document));
            return;
        } catch (error) {
            TwitterLogin.logger().debug("TwitterLogin:: creating twitter token document.");
            await adminDbInstance.saveDocument(tokenDocumentId, document);
            return;
        }
    }

    getOauthToken() {
        return this.oauthToken;
    }

    getOauthTokenSecret() {
        return this.oauthTokenSecret;
    }
}
