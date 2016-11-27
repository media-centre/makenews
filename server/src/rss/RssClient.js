import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import request from "request";
import Logger from "../logging/Logger";
import RssParser from "./RssParser";
import cheerio from "cheerio";
import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";

const FEEDS_NOT_FOUND = "feeds_not_found", httpIndex = 8, NOT_FOUND_INDEX = -1;

export default class RssClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new RssClient();
    }

    async fetchRssFeeds(url) {  //eslint-disable-line consistent-return

        try {
            let feeds = await this.getRssData(url);
            return feeds;
        } catch (error) {
            if (error.message === FEEDS_NOT_FOUND) {
                let root = cheerio.load(error.data);
                let rssLink = root("link[type ^= 'application/rss+xml']");
                let rssUrl = rssLink.attr("href");
                if (rssLink && rssLink.length !== 0) {  //eslint-disable-line no-magic-numbers
                    return await this.getFeedsFromRssUrl(rssUrl, url);

                } else {  //eslint-disable-line no-else-return
                    return await this.crawlForRssUrl(root, url.replace(/\/+$/g, ""));
                }
            } else {  //eslint-disable-line no-else-return
                this.handleUrlError(url, error);
            }

        }

    }

    async getFeedsFromRssUrl(rssUrl, url) {

        if (rssUrl.startsWith("//")) {
            rssUrl = url.substring(0, url.indexOf("//")) + rssUrl;  //eslint-disable-line no-param-reassign, no-magic-numbers
        } else if (rssUrl.startsWith("/")) {
            rssUrl = url.substring(0, url.indexOf("/", httpIndex)) + rssUrl;  //eslint-disable-line no-param-reassign, no-magic-numbers
        }
        try {
            let feeds = await this.getRssData(rssUrl);
            feeds.url = rssUrl;
            return feeds;
        } catch (rssError) {
            return this.handleRequestError(url, rssError);
        }
    }

    async crawlForRssUrl(root, url) {  //eslint-disable-line consistent-return
        let links = new Set();
        let rssUrl = url.substring(0, url.indexOf("/", httpIndex)); //eslint-disable-line no-magic-numbers
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

        if (links.size === 0) {   //eslint-disable-line no-magic-numbers
            this.handleUrlError(url, "no rss links found");
        } else {
            return await this.getCrawledRssData(links, url);

        }
    }

    async getCrawledRssData(links, url) {  //eslint-disable-line consistent-return
        let linksIterator = links.values();
        let link = linksIterator.next().value;
        while (link) {
            try {
                let feeds = await this.getRssData(link, false);
                feeds.url = link;
                return feeds;
            } catch (error) {
                try {
                    let feed = await this.crawlRssList(link, error, url);
                    return feed;
                } catch (err) {
                    link = linksIterator.next().value;
                }
            }
        }
        this.handleUrlError(url, "crawl failed");
    }

    async crawlRssList(link, error, url) {
        let rssPath = link.substring(link.lastIndexOf("/"));
        let errorMessage = { "message": "no rss found" };
        if ((rssPath.indexOf("rss")) !== NOT_FOUND_INDEX) {
            let rssListRoot = cheerio.load(error.data);
            let urlPath = url.substring(url.lastIndexOf("/"));
            urlPath = urlPath.replace(/\.[\w]*$/g, "");
            let rssListLink = rssListRoot("a[href$='" + urlPath + "']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".rss']").attr("href") ||
                rssListRoot("a[href$='" + urlPath + ".xml']").attr("href");
            if (rssListLink) {
                let rssFeeds = await this.getRssData(rssListLink, false);
                rssFeeds.url = rssListLink;
                return rssFeeds;
            }
        }
        throw errorMessage;
    }

    getRssData(url) {
        return new Promise((resolve, reject) => {
            let data = null;
            let requestToUrl = request.get({
                "uri": url,
                "timeout": 6000
            }, (error, response, body) => {
                if (error) {
                    RssClient.logger().error("RssClient:: Request failed for %s. Error: %s", url, JSON.stringify(error));
                    reject({ "message": "Request failed for " + url });
                }
                data = body;
            });
            requestToUrl.on("response", function(res) {
                if (res.statusCode === HttpResponseHandler.codes.OK) {
                    let rssParser = new RssParser(this);
                    rssParser.parse(url).then(feeds => {
                        RssClient.logger().debug("RssClient:: successfully fetched feeds for %s.", url);
                        resolve(feeds);
                    }).catch(error => {
                        RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
                        reject({ "message": FEEDS_NOT_FOUND, "data": data });
                    });
                } else {
                    RssClient.logger().error("RssClient:: %s returned invalid status code '%s'.", res.statusCode);
                    reject({ "message": "Bad status code" });
                }

            });
        });
    }

    async addURL(url) {                                                     //eslint-disable-line consistent-return
        try {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            let response = await this.fetchRssFeeds(url);
            let name = response.meta.title;
            let document = { "name": name, "url": url, "docType": "source", "sourceType": "web" };
            let dbInstance = await AdminDbClient.instance(adminDetails.couchDbAdmin.username, adminDetails.couchDbAdmin.password, adminDetails.db);
            await dbInstance.saveDocument(url, document);
            RssClient.logger().debug("RssClient:: successfully added Document to database.");
            return "URL added to Database";
        }catch(error) {
            RssClient.logger().error("RssClient:: Error while adding document %j.", error);
            this.handleUrlError(url, error);
        }
    }

    async searchURL(key) {                                                  //eslint-disable-line consistent-return
        try {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            let dbInstance = await AdminDbClient.instance(adminDetails.couchDbAdmin.username, adminDetails.couchDbAdmin.password, adminDetails.db);
            let selector = {
                "selector": {
                    "name": {
                        "$eq": key
                    }
                }
            };
            let document = dbInstance.findDocuments(selector);
            RssClient.logger().debug("RssClient:: successfully searched the urls for key.");
            return document;
        }catch (error) {
            RssClient.logger().error("RssClient:: request failed for entered key. Error: %j.", error);
            this.handleRequestError(key, error);
        }
    }

    handleUrlError(url, error) {
        let errorMessage = { "message": url + " is not a proper feed" };
        RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
        throw errorMessage;
    }

    handleRequestError(url, error) {
        let errorMessage = { "message": "Request failed for " + url };
        RssClient.logger().error("RssClient:: Request failed for %s. Error: %s", url, JSON.stringify(error));
        throw errorMessage;
    }
}


