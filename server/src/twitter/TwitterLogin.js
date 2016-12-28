import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import Logger from "../logging/Logger";
import OAuth from "oauth";

let oauthTokenMap = {};
export default class TwitterLogin {
    constructor(oauthToken, oauthTokenSecret, clientCallbackUrl, userName) {
        this.userName = userName;
        //this.oauthToken = oauthToken;
        //this.oauthTokenSecret = oauthTokenSecret;
        this.oauthToken = "4858648693-rZMefoq2jUGXiPhktXV12QUsSGdnYPfO7Ik1jth";
        this.oauthTokenSecret = "wGadn7VNQBm6FRRfLAuJFWJ1Hcbfn6lNIRtkUgCXvo4Ht";
        this.clientCallbackUrl = clientCallbackUrl;
        this.oauth = TwitterLogin.createOAuthInstance();
    }

    static logger() {
        return Logger.instance();
    }

    static instance(options = {}) {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            if(options.previouslyFetchedOauthToken) {
                TwitterLogin.logger().debug("TwitterLogin:: returning existing twitter login instance with auth token");
                let tokenInfo = oauthTokenMap[options.previouslyFetchedOauthToken];
                let twitterInstance = new TwitterLogin(options.previouslyFetchedOauthToken, tokenInfo.oauthTokenSecret, tokenInfo.clientCallbackUrl, tokenInfo.userName);
                resolve(twitterInstance);
            } else {
                new TwitterLogin()._requestTokenFromTwitter(options.serverCallbackUrl).then(instance => {
                    TwitterLogin.logger().debug("TwitterLogin:: creating twitter login instance.");
                    oauthTokenMap[instance.oauthToken] = { "oauthTokenSecret": instance.oauthTokenSecret, "clientCallbackUrl": options.clientCallbackUrl, "userName": options.userName };
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

    saveToken(oauthAccessToken, oauthAccessTokenSecret) {
        let tokenDocumentId = this.userName + "_twitterToken";
        let document = {
            "oauthAccessToken": oauthAccessToken,
            "oauthAccessTokenSecret": oauthAccessTokenSecret
        };
        return new Promise((resolve) => {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then((dbInstance) => {
                dbInstance.getDocument(tokenDocumentId).then((fetchedDocument) => {
                    TwitterLogin.logger().debug("TwitterLogin:: successfully fetched existing twitter token from db.");
                    dbInstance.saveDocument(tokenDocumentId, Object.assign({}, fetchedDocument, document)).then(() => { //eslint-disable-line max-nested-callbacks
                        TwitterLogin.logger().debug("TwitterLogin:: successfully saved twitter token.");
                        resolve();
                    });
                }).catch(() => {
                    TwitterLogin.logger().debug("TwitterLogin:: creating twitter token document.");
                    dbInstance.saveDocument(tokenDocumentId, document).then(() => { //eslint-disable-line max-nested-callbacks
                        TwitterLogin.logger().debug("TwitterLogin:: successfully saved twitter token.");
                        resolve();
                    });
                });
            });
        });
    }

    getOauthToken() {
        return this.oauthToken;
    }

    getOauthTokenSecret() {
        return this.oauthTokenSecret;
    }
}
