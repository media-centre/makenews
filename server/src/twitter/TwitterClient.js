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

    async fetchHandles(userName, keyword, page = 1, preFirstId) { //eslint-disable-line no-magic-numbers
        let tokenInfo = await this.getAccessTokenAndSecret(userName);
        return new Promise((resolve, reject) => {
            let [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
            let oauth = TwitterLogin.createOAuthInstance();
            let handlesApi = "/friends/list.json";
            let handlesWithKeyApi = `/users/search.json?q=${keyword}&page=${page}`;
            let getHandles = keyword ? `${this._baseUrl()}${handlesWithKeyApi}` : `${this._baseUrl()}${handlesApi}`;

            oauth.get(getHandles, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
                if (error) {
                    TwitterClient.logger().error(`TwitterClient:: error fetching twitter handles for ${getHandles}, Error: ${error}`);
                    reject(error);
                } else {
                    let jsonParsedData = JSON.parse(data);
                    if (jsonParsedData.length) {
                        if (preFirstId === jsonParsedData[0].id_str) { //eslint-disable-line no-magic-numbers
                            TwitterClient.logger().error(`TwitterClient:: no more results ${getHandles}`);
                            resolve({ "docs": [] });
                        }
                        let parseData = TwitterParser.instance().parseHandle(jsonParsedData);
                        let resultData = {
                            "docs": parseData,
                            "paging": { "page": page + 1 }, //eslint-disable-line no-magic-numbers
                            "twitterPreFirstId": parseData[0].id //eslint-disable-line no-magic-numbers
                        };
                        TwitterClient.logger().debug(`TwitterClient:: successfully fetched twitter handles for ${keyword}`);
                        resolve(resultData);
                    } else {
                        TwitterClient.logger().error(`TwitterClient:: no sources for ${getHandles}`);
                        resolve({ "docs": [] });
                    }
                }
            });
        });
    }

    async fetchFollowings(userName, nextCursor = -1) { //eslint-disable-line no-magic-numbers
        if(nextCursor === "0") { //eslint-disable-line no-magic-numbers
            return {
                "docs": [],
                "paging": { "page": 0 }
            };
        }
        let tokenInfo = await this.getAccessTokenAndSecret(userName);
        return new Promise((resolve, reject) => {
            let [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
            let oauth = TwitterLogin.createOAuthInstance();
            let handlesApi = `${this._baseUrl()}/friends/list.json?cursor=${nextCursor}&count=40`;

            oauth.get(handlesApi, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
                if (error) {
                    TwitterClient.logger().error(`TwitterClient:: error fetching twitter followings for ${handlesApi}, Error: ${error}`);
                    reject(error);
                } else {
                    let jsonParsedData = JSON.parse(data);
                    if (jsonParsedData.users.length) {
                        let parseData = TwitterParser.instance().parseHandle(jsonParsedData.users);
                        let resultData = {
                            "docs": parseData,
                            "paging": { "page": jsonParsedData.next_cursor }
                        };
                        TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter followings");
                        resolve(resultData);
                    } else {
                        TwitterClient.logger().error(`TwitterClient:: no sources for ${handlesApi}`);
                        resolve({ "docs": [] });
                    }
                }
            });
        });
    }
}
