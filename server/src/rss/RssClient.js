"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import Logger from "../logging/Logger.js";
import RssParser from "./RssParser";
import cheerio from "cheerio";
const FEEDS_NOT_FOUND = "feeds_not_found", httpIndex = 8, NOT_FOUND_INDEX = -1;

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
                        let rssUrl = rssLink.attr("href");
                        if(rssUrl.startsWith("//")) {
                            rssUrl = url.substring(0, url.indexOf("//")) + rssUrl;
                        } else if(rssUrl.startsWith("/")) {
                            rssUrl = url.substring(0, url.indexOf("/", httpIndex)) + rssUrl;
                        }
                        this.getRssData(rssUrl).then(feeds => {
                            feeds.url = rssUrl;
                            resolve(feeds);
                        }).catch(rssError => {
                            this.handleRequestError(url, rssError, reject);
                        });
                    } else {
                        this.crawlForRssUrl(root, url.replace(/\/+$/g, ""), resolve, reject);
                    }
                } else {
                    this.handleUrlError(url, error, reject);
                }
            });
        });
    }

    crawlForRssUrl(root, url, resolve, reject) {
        let links = new Set();
        let rssUrl = url.substring(0, url.indexOf("/", httpIndex));
        let relativeLinks = root("a[href^='/']");
        relativeLinks.each(function() {
            links.add(rssUrl + root(this).attr("href"));
        });

        rssUrl = rssUrl.replace(/.*?:\/\//g, "");
        rssUrl = rssUrl.replace("www.", "");
        let absoluteLinks = root("a[href*='" + rssUrl + "']");
        absoluteLinks.each(function() {
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
                    this.crawlRssList(link, error, url, resolve);
                    if (count === links.size) {
                        this.handleUrlError(link, error, reject);
                    }
                });
            });
        }
    }

    crawlRssList(link, error, url, resolve) {
        let rssPath = link.substring(link.lastIndexOf("/"));
        if ((rssPath.indexOf("rss")) !== NOT_FOUND_INDEX) {
            let rssListRoot = cheerio.load(error.data);
            let urlPath = url.substring(url.lastIndexOf("/"));
            urlPath = urlPath.replace(/\.[\w]*$/g, "");
            let rssListLink = rssListRoot("a[href$='" + urlPath + "']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".rss']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".xml']").attr("href");
            if (rssListLink) {
                this.getRssData(rssListLink, false).then(rssFeeds => {
                    rssFeeds.url = rssListLink;
                    resolve(rssFeeds);
                });
            }
        }
    }

    getRssData(url) {
        return new Promise((resolve, reject) => {
            let data = null;
            let requestToUrl = request.get({
                "uri": url,
                "timeout": 6000
            }, (error, response, body) => {
                if(error) {
                    this.handleRequestError(url, error, reject);
                }
                data = body;
            });
            requestToUrl.on("response", function(res) {
                if (res.statusCode !== HttpResponseHandler.codes.OK) {
                    RssClient.logger().error("RssClient:: %s returned invalid status code '%s'.", res.statusCode);
                    reject({ "message": "Bad status code" });
                }
                let rssParser = new RssParser(this);
                rssParser.parse().then(feeds => {
                    RssClient.logger().debug("RssClient:: successfully fetched feeds for %s.", url);
                    resolve(feeds);
                }).catch(error => {
                    RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
                    reject({ "message": FEEDS_NOT_FOUND, "data": data });
                });
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
