import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import request from "request";
import Logger from "../logging/Logger";
import RssParser from "./RssParser";
import cheerio from "cheerio";
import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";
import CouchClient from "../CouchClient";
import { searchDocuments } from "../LuceneClient";
import R from "ramda"; //eslint-disable-line id-length
import DateUtil from "../util/DateUtil";

const FEEDS_NOT_FOUND = "feeds_not_found", httpIndex = 8;
const NOT_FOUND_INDEX = -1, DOCS_PER_REQUEST = 25;

export default class RssClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new RssClient();
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
        /* TODO: remove the loop statement*/ //eslint-disable-line
        while (link) { //eslint-disable-line no-loops/no-loops
            try {
                let feeds = await this.getRssData(link, false);
                feeds.url = link;
                return feeds;
            } catch (error) {
                try {
                    return await this.crawlRssList(link, error, url);
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
                        resolve({ "docs": feeds.items, "title": feeds.meta.title, "paging": { "since": DateUtil.getCurrentTimeInSeconds() } });
                    }).catch(error => {
                        RssClient.logger().error(`RssClient:: ${url} is not a proper feed url. Error: ${JSON.stringify(error)}.`);
                        reject({ "message": FEEDS_NOT_FOUND, "data": data });
                    });
                } else {
                    RssClient.logger().error("RssClient:: %s returned invalid status code '%s'.", url, res.statusCode);
                    reject({ "message": "Bad status code" });
                }

            });
        });
    }

    async fetchRssFeeds(url) {  //eslint-disable-line consistent-return
        try {
            return await this.getRssData(url);
        } catch (error) {
            if (error.message === FEEDS_NOT_FOUND) {
                let root = cheerio.load(error.data);
                let rssLink = root("link[type ^= 'application/rss+xml']");
                let rssUrl = rssLink.attr("href");
                if (rssLink && rssLink.length) {
                    return await this.getFeedsFromRssUrl(rssUrl, url);
                }
                return await this.crawlForRssUrl(root, url.replace(/\/+$/g, ""));
            } else {  //eslint-disable-line no-else-return
                this.handleUrlError(url, error);
            }
        }
    }

    async addURL(url, accessToken) {
        const response = await this.fetchRssFeeds(url);
        const name = response.title;
        let document = { "name": name, "url": url, "docType": "source", "sourceType": "web" };
        let existingUrl = await this.addUrlToCommon(document);

        if(existingUrl) {
            document.url = existingUrl;
        }
        await this.addURLToUser(document, accessToken);
        return { name, "url": document.url };
    }

    async addUrlToCommon(document) { //eslint-disable-line consistent-return
        let url = document.url;

        let strippedUrl = url.replace(/.*:?\/\/(www.)?/, "");
        if(url.endsWith("/")) {
            strippedUrl = strippedUrl.slice(0, strippedUrl.length - 1); //eslint-disable-line no-magic-numbers
        }

        const urlCombinations = [`http://${strippedUrl}`, `http://${strippedUrl}/`, `http://www.${strippedUrl}`, `http://www.${strippedUrl}/`,
            `https://${strippedUrl}`, `https://${strippedUrl}/`, `https://www.${strippedUrl}`, `https://www.${strippedUrl}/`];

        const adminDetails = ApplicationConfig.instance().adminDetails();
        let dbInstance = await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);

        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "sourceType": {
                    "$eq": "web"
                },
                "_id": {
                    "$in": urlCombinations
                }
            }
        };

        const sourceDocuments = await dbInstance.findDocuments(selector);

        if((sourceDocuments.docs).length) {
            const [sourceDocument] = sourceDocuments.docs;
            return sourceDocument.url;
        }

        try {
            await dbInstance.saveDocument(encodeURIComponent(url), document);
            RssClient.logger().debug("RssClient:: successfully added Document to common database.");
        } catch (error) {
            if(error.status !== HttpResponseHandler.codes.CONFLICT) {
                RssClient.logger().error("RssClient:: Unexpected Error from Db. Error: %j", error);
                throw "Unable to add the url"; //eslint-disable-line no-throw-literal
            }
        }
    }

    async addURLToUser(document, accessToken) {
        let couchClient = CouchClient.instance(accessToken);

        try {
            await couchClient.saveDocument(encodeURIComponent(document.url), document);
            RssClient.logger().debug("RssClient:: successfully added Document to user database.");
        } catch (error) {
            RssClient.logger().error("RssClient:: Unexpected Error from Db. Error: %j", error);
            if(error.status === HttpResponseHandler.codes.CONFLICT) {
                throw "URL already exist"; //eslint-disable-line no-throw-literal
            }
            throw "Unable to add the url"; //eslint-disable-line no-throw-literal
        }
    }

    async searchURL(keyword, skip) {
        let result = {};
        let queryString = keyword ? `name:${keyword}* OR url:${keyword}*` : "*:*";
        try {
            let query = {
                "q": queryString,
                "limit": DOCS_PER_REQUEST,
                skip
            };
            let dbName = ApplicationConfig.instance().adminDetails().db;
            let response = await searchDocuments(dbName, "_design/webUrlSearch/by_name", query);

            result.docs = R.map(row => row.fields)(response.rows);
            result.paging = { "offset": (skip + DOCS_PER_REQUEST) };
        
            RssClient.logger().debug("RssClient:: successfully searched the urls for key.");
        } catch (error) {
            this.handleRequestError(keyword, error);
        }
        return result;
    }
    
    handleUrlError(url, error) {
        let errorMessage = { "message": `${url} is not a proper feed` };
        RssClient.logger().error(`RssClient:: ${url} is not a proper feed url. Error: ${JSON.stringify(error)}`);
        throw errorMessage;
    }

    handleRequestError(url, error) {
        let errorMessage = { "message": `Request failed for url: ${url}, error: ${JSON.stringify(error)}` };
        RssClient.logger().error(`RssClient:: Request failed for ${url}. Error: ${JSON.stringify(error)}`);
        throw errorMessage;
    }
}
