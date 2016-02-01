"use strict";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import OAuth from "oauth";
let oauthTokenMap = {};
export default class TwitterLogin {
    constructor(oauthToken, oauthTokenSecret, clientCallbackUrl) {
        this.oauthToken = oauthToken;
        this.oauthTokenSecret = oauthTokenSecret;
        this.clientCallbackUrl = clientCallbackUrl;
        this.oauth = TwitterLogin.createOAuthInstance();
    }
    static instance(options = {}) {
        return new Promise((resolve, reject) => {
            if(!options.previouslyFetchedOauthToken) {
                new TwitterLogin()._requestTokenFromTwitter(options.serverCallbackUrl).then(instance => {
                    oauthTokenMap[instance.oauthToken] ={"oauthTokenSecret": instance.oauthTokenSecret, "clientCallbackUrl": options.clientCallbackUrl};
                    resolve(instance);
                });
            } else {
                let tokenInfo = oauthTokenMap[options.previouslyFetchedOauthToken];
                let twitterInstance = new TwitterLogin(options.previouslyFetchedOauthToken, tokenInfo.oauthTokenSecret, tokenInfo.clientCallbackUrl);
                resolve(twitterInstance);
            }
        });
    }

    static createOAuthInstance() {
        return new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            ApplicationConfig.instance().twitter().consumerKey,
            ApplicationConfig.instance().twitter().consumerSecret,
            '1.0A',
            null,
            'HMAC-SHA1'
        );
    }

    _requestTokenFromTwitter(serverCallbackUrl) {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthRequestToken({"oauth_callback": serverCallbackUrl}, (error, oauthToken, oauthTokenSecret, results) => {
                if (error) {
                    reject(error);
                }
                this.oauthToken = oauthToken;
                this.oauthTokenSecret = oauthTokenSecret;
                resolve(this);
            });
        });
    }

    accessTokenFromTwitter(oauthVerifier) {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthAccessToken(this.oauthToken, this.oauthTokenSecret, oauthVerifier, (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
                console.log(oauthAccessToken, oauthAccessTokenSecret, results);
            });
            resolve(this.clientCallbackUrl);
        });
    }

    getOauthToken() {
        return this.oauthToken;
    }

    getOauthTokenSecret() {
        return this.oauthTokenSecret;
    }
}
