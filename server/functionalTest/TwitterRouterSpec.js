/* eslint max-nested-callbacks: [2, 5] react/jsx-wrap-multilines:0 */
/* eslint handle-callback-err: 0 no-magic-numbers:0  */
import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "../src/config/ApplicationConfig";
import { assert } from "chai";
import CouchSession from "../src/CouchSession";

describe("TwitterRouterSpec", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("TwitterRouterSpec", (done)=> {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });
    describe("TwitterReaderRoutes", () => {
        it("responds to /twitter-feeds with 401 if user is not logged in", (done) => {
            request(serverIp)
                .get("/twitter-feeds")
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, res.statusCode);
                    done();
                });
        });

        xit("should return data if the url is valid", (done) => {
            let expectedValues = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, { "id": 2, "id_str": "124", "text": "Tweet 2" }] };
            request(serverIp)
                .get("/twitter-feeds?url=@the_hindu&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    assert.strictEqual("123", expectedValues.statuses[0].id_str);
                    assert.strictEqual("124", expectedValues.statuses[1].id_str);
                    done();
                });
        });

        it("should return 400 error if url is invalid", (done) => {
            request(serverIp)
                .get("/twitter-feeds?url=myTest&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    done();
                });
        });

        xit("should timeout if the response from twitter takes more time", (done) => {
            request(serverIp)
                .get("/twitter-feeds?url=timeout&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    done();
                });
        });

        xit("should fetch feeds for multiple twitter tags", (done) => {
            let expectedResponse = {
                "29AE8E3D-4EDA-D0EB-AC45-9AB2A8C57463": {
                    "statuses": [
                        {
                            "id": "695147136451612700",
                            "id_str": "695147136451612672",
                            "text": "If you are considering adopting continuous delivery, pause any tool evalutation and assess your readiness"
                        },
                        {
                            "id": "695146308445741000",
                            "id_str": "695146308445741056",
                            "text": "In web security basics pt2 @cairnsc & @D_Somerfield foil a Supreme Court justice as an attack vector"
                        }
                    ]
                },
                "9BBDA22F-66D5-7096-B82B-94B720845B2E": {
                    "statuses": [
                        {
                            "id": "695148613308149800",
                            "id_str": "695148613308149760",
                            "text": "RT @ICC: WATCH: This is one way to keep the batsman guessing - The amazing ambidextrous Mendis!"
                        },
                        {
                            "id": "695148540646027300",
                            "id_str": "695148540646027264",
                            "text": "RT @livingrichpe: @ICC are you keeping quiet while Buhari keep"
                        }
                    ]
                }
            };
            request(serverIp)
                .post("/twitter-batch-feeds")
                .send({
                    "data": [
                        {
                            "timestamp": "2016-02-04T03:40:29+00:00",
                            "url": "@martinfowler",
                            "id": "29AE8E3D-4EDA-D0EB-AC45-9AB2A8C57463"
                        },
                        {
                            "timestamp": "2016-02-04T07:29:27+00:00",
                            "url": "@icc",
                            "id": "9BBDA22F-66D5-7096-B82B-94B720845B2E"
                        }
                    ],
                    "userName": "test"
                })
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedResponse);
                    done();
                });
        });

    });
});
