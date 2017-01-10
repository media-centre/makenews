import TwitterParser from "../../src/twitter/TwitterParser";
import { assert, expect } from "chai";

describe("TwitterParser", () => {

    describe("parseHandle", () => {
        let handleFromTwitter = null;
        beforeEach("parseHandle", () => {
            handleFromTwitter = [
                {
                    "id_str": "123",
                    "name": "india1",
                    "screen_name": "mera bharath1",
                    "location": "madurai",
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1718987370/cute-baby-girl-pics1_normal.jpg"
                },
                {
                    "id_str": "456",
                    "name": "india2",
                    "screen_name": "mera bharath2",
                    "location": "madurai",
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1718987370/cute-baby-girl-pics1_normal.jpg"
                }
            ];

        });

        it("should return handle with specific fields", () => {
            let twitterParser = TwitterParser.instance();
            let expectedHandle = twitterParser.parseHandle(handleFromTwitter);
            let parsedHandle = [{
                "id": "123",
                "picture": {
                    "data": {
                        "url": "https://pbs.twimg.com/profile_images/1718987370/cute-baby-girl-pics1_normal.jpg"
                    }
                },
                "name": "india1"
            }, {
                "id": "456",
                "picture": {
                    "data": {
                        "url": "https://pbs.twimg.com/profile_images/1718987370/cute-baby-girl-pics1_normal.jpg"
                    }
                },
                "name": "india2"
            }];
            assert.deepEqual(parsedHandle, expectedHandle);
        });
    });

    describe("parseTweets", () => {

        let twitterParser = null;
        beforeEach("parseTweets", () => {
            twitterParser = TwitterParser.instance();
        });

        it("should return tweets with the desired format of description type", ()=> {
            let sourceId = "123";
            let actualTweet = [{
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }]
                }
            }];

            let expectedTweet = [{
                "_id": "123457",
                "docType": "feed",
                "sourceType": "twitter",
                "description": "Hindu twitter text - 123457",
                "title": "",
                "link": "https://twitter.com/123/status/123457",
                "pubDate": "2001-12-11T06:11:56Z",
                "tags": ["tag1", "tag2"],
                "images": [],
                "videos": []
            }];
            let newTweets = twitterParser.parseTweets(sourceId, actualTweet);
            expect(newTweets).to.deep.equal(expectedTweet);
        });

        it("should return tweets with the desired format of type imagecontent", ()=> {
            let sourceId = "123";
            let actualTweet = [{
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }],
                    "media": [{ "media_url": "http://www.test.com", "media_url_https": "https://www.test.com" }]
                }
            }];

            let expectedTweet = [{
                "_id": "123457",
                "docType": "feed",
                "sourceType": "twitter",
                "description": "Hindu twitter text - 123457",
                "title": "",
                "link": "https://twitter.com/123/status/123457",
                "pubDate": "2001-12-11T06:11:56Z",
                "tags": ["tag1", "tag2"],
                "images": [{ "url": "https://www.test.com" }],
                "videos": []
            }];
            let newTweets = twitterParser.parseTweets(sourceId, actualTweet);
            expect(newTweets).to.deep.equal(expectedTweet);
        });

        it("should return tweets with the desired format of type gallery", ()=> {
            let sourceId = "123";
            let actualTweet = [{
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }],
                    "media": [{ "media_url": "http://www.test1.com", "media_url_https": "https://www.test1.com" },
                        { "media_url": "http://www.test2.com", "media_url_https": "https://www.test2.com" }]
                }
            }];

            let expectedTweet = [{
                "_id": "123457",
                "docType": "feed",
                "sourceType": "twitter",
                "description": "Hindu twitter text - 123457",
                "title": "",
                "link": "https://twitter.com/123/status/123457",
                "pubDate": "2001-12-11T06:11:56Z",
                "tags": ["tag1", "tag2"],
                "images": [
                    {
                        "url": "https://www.test1.com"
                    },
                    {
                        "url": "https://www.test2.com"
                    }
                ],
                "videos": []
            }];
            let newTweets = twitterParser.parseTweets(sourceId, actualTweet);
            expect(newTweets).to.deep.equal(expectedTweet);
        });

        it("should return tweets with the videos if tweet contains extended entities", ()=> {
            let sourceId = "123";
            let actualTweet = [{
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }],
                    "media": [{ "media_url": "http://www.test1.com", "media_url_https": "https://www.test1.com" },
                        { "media_url": "http://www.test2.com", "media_url_https": "https://www.test2.com" }]
                },
                "extended_entities": {
                    "media": [{ "media_url": "http://www.test1.com", "media_url_https": "https://www.test1.com" },
                        { "media_url": "http://www.test2.com", "media_url_https": "https://www.test2.com" }]
                }
            }];

            let expectedTweet = [{
                "_id": "123457",
                "docType": "feed",
                "sourceType": "twitter",
                "description": "Hindu twitter text - 123457",
                "title": "",
                "link": "https://twitter.com/123/status/123457",
                "pubDate": "2001-12-11T06:11:56Z",
                "tags": ["tag1", "tag2"],
                "images": [
                    {
                        "url": "https://www.test1.com"
                    },
                    {
                        "url": "https://www.test2.com"
                    }
                ],
                "videos": [
                    {
                        "thumbnail": "https://www.test1.com"
                    },
                    {
                        "thumbnail": "https://www.test2.com"
                    }]
            }];
            let newTweets = twitterParser.parseTweets(sourceId, actualTweet);
            expect(newTweets).to.deep.equal(expectedTweet);
        });
    });
});
