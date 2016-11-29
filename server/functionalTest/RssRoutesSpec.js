/* eslint max-nested-callbacks: [2, 5] react/jsx-wrap-multilines:0 */
/* eslint handle-callback-err: 0 no-magic-numbers:0  */
import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "../src/config/ApplicationConfig";
import { assert, expect } from "chai";
import CouchSession from "../src/CouchSession";

const requestTime = 7000;
describe("RssRoutesSpec", () => {
    describe("RssRoutesSpec", () => {
        let accessToken = null, applicationConfig = null, serverIp = null;
        before("RssRoutesSpec", (done)=> {
            applicationConfig = new ApplicationConfig();
            serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
            CouchSession.login("test", "test").then((token) => {
                accessToken = token;
                done();
            });
        });

        it("should return status OK if the url is empty", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    done();
                });
        });

        it("should return data if the url is valid", (done) => {
            let expectedValues = {
                "items": [{ "title": "sample1", "description": "news cricket" },
                    { "title": "sample2", "description": "news politics" }
                ]
            };

            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/thehindu/rss-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    let items = res.body.items;
                    let expectedItems = expectedValues.items;
                    expect(items.length).to.eq(expectedItems.length);
                    for(let index = 0; index < items.length; index += 1) {
                        expect(items[index].title).to.eq(expectedItems[index].title);
                        expect(items[index].description).to.eq(expectedItems[index].description);
                    }
                    done();
                });
        });

        it("responds with 400 for /rss-feeds if rss fetch returns error", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/thehindu/error-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(res.statusCode, HttpResponseHandler.codes.BAD_REQUEST);
                    assert.strictEqual(res.body.message, "bad request");
                    done();
                });
        });

        it("should timeout if fetching rss feeds exceeds time out", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/gardian/timeout-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(res.statusCode, HttpResponseHandler.codes.BAD_REQUEST);
                    assert.strictEqual(res.body.message, "bad request");
                    done();
                });
        }).timeout(requestTime);

        it("should return successful message when feeds saved for multiple rss urls", (done) => {
            let expectedResponse = "sucessfully added feeds";
            request(serverIp)
                .post("/fetch-all-rss")
                .send({
                    "data": [
                        {
                            "timestamp": "2016-02-04T04:46:39+00:00",
                            "url": "http://localhost:3000/news/cities/bangalore/?service=rss",
                            "id": "B7CF1576-05BB-DD75-BA53-9E9EC1E6C5D4"
                        },
                        {
                            "timestamp": "2016-02-04T04:48:10+00:00",
                            "url": "http://localhost:3000/news/cities/chennai/?service=rss",
                            "id": "214F7943-36F3-84F3-9E21-CDC9939E1468"
                        }
                    ]
                })
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(res.body.message, expectedResponse);
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    done();
                });

        });
    });
});
