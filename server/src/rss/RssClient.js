"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import Logger from "../logging/Logger.js";
import RssParser from "./RssParser";
import cheerio from "cheerio";
const feedPattern = /(application\/(rss\+xml|rdf\+xml|atom\+xml|xml))|(text\/xml)/g;
const FEEDS_NOT_FOUND = "feeds_not_found";

export default class RssClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new RssClient();
    }

    fetchRssFeeds(url) {
        return new Promise((resolve, reject) => {
            this.getRssData(url).then(feeds => {
                resolve(feeds);
            }).catch(error => {
                if(error.message === FEEDS_NOT_FOUND) {
                    let root = cheerio.load(error.data);
                    let rssLink = root("link[type ^= 'application/rss+xml']");
                    if (rssLink && rssLink.length !== 0) {
                        this.getRssData(rssLink.attr("href")).then(feeds => {
                            feeds.url = rssLink.attr("href");
                            resolve(feeds);
                        }).catch(rssError => {
                            this.handleRequestError(url, rssError, reject);
                        });
                    } else {
                        this.crawlForRssUrl(root, url, resolve, reject);
                    }
                } else {
                    this.handleUrlError(url, error, reject);
                }
            });
        });
    }

    crawlForRssUrl(root, url, resolve, reject) {
        let links = new Set();
        let relativeLinks = root("a[href^='/']");
        relativeLinks.each(function() {
            links.add(url + root(this).attr("href"));
        });

        relativeLinks = root("a[href^='" + url + "']");
        relativeLinks.each(function() {
            links.add(root(this).attr("href"));
        });

        if(links.size === 0) {
            this.handleUrlError(url, "no rss links found", reject);
        } else {
            let count = 0;
            links.forEach((link) => {
                this.getRssData(link, false).then(feeds => {
                    feeds.url = link;
                    resolve(feeds);
                }).catch(error => {
                    count += 1;
                    if (count === links.size) {
                        this.handleUrlError(link, error, reject);
                    }
                });
            });
        }
    }

    getRssData(url) {
        return new Promise((resolve, reject) => {
            let isFeed = false;
            let requestToUrl = request.get({
                "uri": url,
                "timeout": 2000
            }, (error, response, body) => {
                if(!isFeed && !error) {
                    reject({ "message": FEEDS_NOT_FOUND, "data": body });
                }
            });

            requestToUrl.on("error", (error) => {
                this.handleRequestError(url, error, reject);
            });
            requestToUrl.on("response", function(res) {
                if (res.statusCode !== HttpResponseHandler.codes.OK) {
                    RssClient.logger().error("RssClient:: %s returned invalid status code '%s'.", res.statusCode);
                    reject({ "message": "Bad status code" });
                }
                isFeed = feedPattern.test(res.headers["content-type"]);
                if (isFeed) {
                    let rssParser = new RssParser(this);
                    rssParser.parse().then(feeds => {
                        RssClient.logger().debug("RssClient:: successfully fetched feeds for %s.", url);
                        resolve(feeds);
                    }).catch(error => {
                        this.handleUrlError(url, error, reject);
                    });
                }
            });
        });
    }

    handleUrlError(url, error, reject) {
        RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
        reject({ "message": url + " is not a proper feed" });
    }

    handleRequestError(url, error, reject) {
        RssClient.logger().error("RssClient:: Request failed for %s. Error: %s", url, JSON.stringify(error));
        reject({ "message": "Request failed for " + url });
    }
}
