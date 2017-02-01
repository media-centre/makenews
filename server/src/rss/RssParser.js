/* eslint no-unused-vars:0 */
import FeedParser from "feedparser";
import Logger from "../logging/Logger";
import CryptUtil from "../../src/util/CryptUtil";

const NEGATIVE_INDEX = -1;

export default class RssParser {
    constructor(response) {
        this.response = response;
        this.feedParser = new FeedParser();
    }

    static logger() {
        return Logger.instance();
    }

    parse(url) {
        return new Promise((resolve, reject) => {
            let items = [];
            this.response.pipe(this.feedParser);
            this.feedParser.on("error", (error) => {
                RssParser.logger().error("RssParser:: Parsing error %s", error);
                reject("Not a feed");
            });

            this.feedParser.on("readable", function() {
                let meta = this.meta, feed = this.read();
                /* TODO: remove the loop statement*/ //eslint-disable-line
                while (feed) { //eslint-disable-line no-loops/no-loops
                    let guid = CryptUtil.hmac("sha256", "appSecretKey", "hex", feed.guid);
                    let feedObject = {
                        "_id": guid,
                        "guid": guid,
                        "title": feed.title,
                        "link": feed.link,
                        "description": feed.description,
                        "pubDate": feed.pubDate,
                        "enclosures": feed.enclosures,
                        "docType": "feed",
                        "sourceType": "web",
                        "sourceUrl": url,
                        "tags": [meta.title],
                        "images": []
                    };
                    if (feed.enclosures && feed.enclosures.length) {
                        feed.enclosures.forEach((item, index) => {  //eslint-disable-line no-loop-func
                            if (!item.type || item.type.indexOf("image") !== NEGATIVE_INDEX) {
                                let image = feed.enclosures[index];
                                image.thumbnail = image.url;
                                feedObject.images.push(image);
                            } else if (item.type.indexOf("video") !== NEGATIVE_INDEX) {
                                feedObject.images.push({ "type": "video", "url": feed.image.url, "thumbnail": feed.image.url });
                            }
                        });
                    }
                    items.push(feedObject);
                    feed = this.read();
                }
            });

            this.feedParser.on("end", function() {
                RssParser.logger().debug("RssParser:: Done parsing feeds.");
                resolve({ "items": items, "meta": this.meta });
            });
        });
    }
}
