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

    async fetchRssFeeds(url) {

        try {
            let feeds = await this.getRssData(url);
            return feeds;
        }
        catch (error) {
            if (error.message === FEEDS_NOT_FOUND) {
                let root = cheerio.load(error.data);
                let rssLink = root("link[type ^= 'application/rss+xml']");
                let rssUrl = rssLink.attr("href");
                console.log(rssUrl + url)
                if (rssLink && rssLink.length !== 0) {
                    return this.getFeedsFromRssUrl(rssUrl,url)

                } else {
                    return this.crawlForRssUrl(root, url.replace(/\/+$/g, ""));
                }
            } else {
                this.handleUrlError(url, error);
            }

        }

    }

    async getFeedsFromRssUrl(rssUrl,url){

        if (rssUrl.startsWith("//")) {
            rssUrl = url.substring(0, url.indexOf("//")) + rssUrl;
        } else if (rssUrl.startsWith("/")) {
            rssUrl = url.substring(0, url.indexOf("/", httpIndex)) + rssUrl;
        }
        try {
            let feeds = await this.getRssData(rssUrl);
            feeds.url = rssUrl;
            return feeds;
        }
        catch (rssError) {
            return this.handleRequestError(url, rssError);
        }
    }

    async crawlForRssUrl(root, url) {
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
            links.forEach(async (link) => {
                try {
                    let feeds = await this.getRssData(link, false);
                    feeds.url = link;
                    resolve(feeds);
                }
                catch(error)  {
                    count += 1;
                    if (count === links.size) {
                        return this.handleUrlError(link, error, reject);
                    }
                    return this.crawlRssList(link, error, url, resolve);

                }
            });
        }
    }

    async crawlRssList(link, error, url) {
        let rssPath = link.substring(link.lastIndexOf("/"));
        if ((rssPath.indexOf("rss")) !== NOT_FOUND_INDEX) {
            let rssListRoot = cheerio.load(error.data);
            let urlPath = url.substring(url.lastIndexOf("/"));
            urlPath = urlPath.replace(/\.[\w]*$/g, "");
            let rssListLink = rssListRoot("a[href$='" + urlPath + "']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".rss']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".xml']").attr("href");
            if (rssListLink) {
                let rssFeeds = await this.getRssData(rssListLink, false)
                rssFeeds.url = rssListLink;
                return rssFeeds;
            };
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


    handleUrlError(url, error) {
        RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
        return ({"message": url + " is not a proper feed"});
    }

    handleRequestError(url, error) {
        RssClient.logger().error("RssClient:: Request failed for %s. Error: %s", url, JSON.stringify(error));
        return ({"message": "Request failed for " + url});
    }
}


