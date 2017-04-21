import ApplicationConfig from "../../src/config/ApplicationConfig";
import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";
import TwitterLogin from "./TwitterLogin";
import TwitterParser from "./TwitterParser";
import DateUtils from "../util/DateUtil";
import { maxFeedsPerRequest } from "./../util/Constants";
import R from "ramda"; //eslint-disable-line id-length

export const searchApi = "/search/tweets.json", userApi = "/statuses/user_timeline.json", FEEDS_COUNT = 100;
const twitterTypes = { "TAG": "tag", "USER": "user" };
export default class TwitterClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new TwitterClient();
    }
    
    async fetchTweets(url, userName, since, sinceId = "1") {
        const type = url.startsWith("#") || url.startsWith("%23") ? twitterTypes.TAG : twitterTypes.USER;
        const timestampQuery = since ? `&since=${this._getTwitterTimestampFormat(since)}` : "";
        const tokenInfo = await this.getAccessTokenAndSecret(userName);
        const searchUrl = type === twitterTypes.TAG
            ? `${this._baseUrl()}${searchApi}?q=${encodeURIComponent(url)}&count=${FEEDS_COUNT}&filter=retweets${timestampQuery}&since_id=${sinceId}`
            : `${this._baseUrl()}${userApi}?count=${FEEDS_COUNT}&exclude_replies=true&include_rts=false${timestampQuery}&since_id=${sinceId}&user_id=${url}`;
        const oauth = TwitterLogin.createOAuthInstance();
        const twitterMaxFeedsLimit = ApplicationConfig.instance().twitter().maxFeeds;
        
        const tweets = await this.recursivelyFetchTweets(searchUrl, oauth, tokenInfo, twitterMaxFeedsLimit);
        if(tweets.error) {
            TwitterClient.logger().error("TwitterClient:: error fetching feeds for %s", url);
        }
        const parsedTweets = TwitterParser.instance().parseTweets(url, tweets.docs);
        TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter feeds for %s", url);
        const respSinceId = parsedTweets.length ? R.head(parsedTweets)._id : sinceId;
        return {
            "docs": parsedTweets,
            "paging": {
                "sinceId": respSinceId,
                "since": DateUtils.getCurrentTimeInSeconds()
            }
        };
    }

    async recursivelyFetchTweets(url, oauth, tokenInfo, twitterMaxFeedsLimit, feeds = []) {
        let feedsData = { "docs": feeds };
        try {
            const tweets = await this.requestTweets(url, oauth, tokenInfo);
            const feedsAccumulator = feeds.concat(tweets);
            if (tweets.length === maxFeedsPerRequest.twitter && feedsAccumulator.length < twitterMaxFeedsLimit) {
                const newUrl = `${url}&max_id:${R.last(tweets).id_str}`;
                return await this.recursivelyFetchTweets(newUrl, oauth, tokenInfo, twitterMaxFeedsLimit, feedsAccumulator);
            }
            feedsData.docs = feedsAccumulator;
        } catch(err) {
            feedsData.error = "Error occurred while fetching feeds";
        }
        return feedsData;
    }
    
    requestTweets(url, oauth, tokenInfo) {
        return new Promise((resolve, reject) => {
            oauth.get(url, ...tokenInfo, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    const tweetData = JSON.parse(data);
                    const tweets = tweetData.statuses ? tweetData.statuses : tweetData;
                    resolve(tweets);
                }
            });
        });
    }

    async getAccessTokenAndSecret(userName) {
        let tokenDocumentId = userName + "_twitterToken";
        const adminDetails = ApplicationConfig.instance().adminDetails();
        try {
            let dbInstance = await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);
            let fetchedDocument = await dbInstance.getDocument(tokenDocumentId);
            TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter access token for user %s.", userName);
            return ([fetchedDocument.oauthAccessToken, fetchedDocument.oauthAccessTokenSecret]);
        } catch (error) {
            TwitterClient.logger().error("TwitterClient:: access token not found for user %s.", userName);
            let err = "Not authenticated with twitter";
            throw err;
        }
    }

    _baseUrl() {
        return ApplicationConfig.instance().twitter().url;
    }

    _getTwitterTimestampFormat(timestamp) {
        let dateObj = new Date(timestamp);
        return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();  //eslint-disable-line no-magic-numbers
    }

    async fetchUserInfoFromHandle(username, handle) {
        const api = `${this._baseUrl()}/users/show.json?screen_name=${encodeURIComponent(handle)}`;
        try {
            const parsedData = await this._getTwitterData(api, username);
            TwitterClient.logger().debug(`TwitterClient:: successfully fetched user info for handle:: ${handle}`);
            return {
                "name": parsedData.name,
                "url": parsedData.id_str
            };
        } catch (err) {
            TwitterClient.logger().error(`TwitterClient:: failed to fetch user info for handle:: ${handle}`);
            throw `Requested user ${handle} not found`; //eslint-disable-line no-throw-literal
        }
    }
    
    async fetchHandles(userName, keyword, page = 1, preFirstId) { //eslint-disable-line no-magic-numbers
        let handlesWithKeyApi = `${this._baseUrl()}/users/search.json?q=${keyword}&page=${page}&count=12`;
        const parsedData = await this._getTwitterData(handlesWithKeyApi, userName);

        if (parsedData.length && preFirstId !== parsedData[0].id_str) { //eslint-disable-line no-magic-numbers
            let parseData = TwitterParser.instance().parseHandle(parsedData);
            let resultData = {
                "docs": parseData,
                "paging": { "page": page + 1 }, //eslint-disable-line no-magic-numbers
                "twitterPreFirstId": parseData[0].id //eslint-disable-line no-magic-numbers
            };
            TwitterClient.logger().debug(`TwitterClient:: successfully fetched twitter handles for ${keyword}`);
            return resultData;
        }
        TwitterClient.logger().error(`TwitterClient:: no sources for ${handlesWithKeyApi}`);
        return { "docs": [] };
    }

    async fetchFollowings(userName, nextCursor = -1) { //eslint-disable-line no-magic-numbers
        if(nextCursor === "0") {
            return {
                "docs": [],
                "paging": { "page": 0 }
            };
        }
        const handlesApi = `${this._baseUrl()}/friends/list.json?cursor=${nextCursor}&count=40`;
        const parsedData = await this._getTwitterData(handlesApi, userName);
        if (parsedData.users.length) {
            const parseData = TwitterParser.instance().parseHandle(parsedData.users);
            const resultData = {
                "docs": parseData,
                "paging": { "page": parsedData.next_cursor }
            };
            TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter followings");
            return resultData;
        }
        TwitterClient.logger().error(`TwitterClient:: no sources for ${handlesApi}`);
        return { "docs": [] };
    }

    async _getTwitterData(url, userName) {
        const tokenInfo = await this.getAccessTokenAndSecret(userName);
        return new Promise((resolve, reject) => {
            const [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
            const oauth = TwitterLogin.createOAuthInstance();

            oauth.get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
                if (error) {
                    TwitterClient.logger().error(`TwitterClient:: error fetching twitter data for ${url}, Error: ${error}`);
                    reject(error);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
}
