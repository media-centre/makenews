/* eslint max-nested-callbacks: [2, 5] react/jsx-wrap-multilines:0 */
/* eslint handle-callback-err: 0 no-magic-numbers:0 */

import request from "supertest";
import { assert } from "chai";
import ApplicationConfig from "../src/config/ApplicationConfig";
import CouchSession from "../src/CouchSession";

describe("FacebookRoutesSpec", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("FacebookRoutesSpec", (done)=> {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        }).catch(error => {
            done(new Error(error));
        });
    });

    describe("/facebook-set-token", () => {
        it("should set the token", (done) => {
            let currentTime = new Date().getTime();
            let expiresAfter = currentTime + (123456 * 1000);
            request(serverIp)
                .post("/facebook-set-token")
                .send({
                    "accessToken": "1234"
                })
                .set("Cookie", accessToken)
                .end((err, res) => {
                    let tokenDiff = Math.abs(res.body.expires_after - expiresAfter) < 1000;
                    assert.isTrue(tokenDiff);
                    done();
                });
        });
    });

    describe("/facebook-sources", () => {
        it("should fetch the page source results", (done) => {

            const expectedData = {
                "paging": {
                    "after": "enc_AdClDCor0"
                },
                "data": [{
                    "id": "26781952138",
                    "name": "The Times of India",
                    "picture": {
                        "data": {
                            "is_silhouette": false,
                            "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/14457373_10154629036722139_4431901373813970507_n.jpg?oh=6c51fabdc9f82578d5ed7b1ed4b353f0&oe=58DCB705"
                        }
                    }
                }, {
                    "id": "227797153941209",
                    "name": "The Times of India | Entertainment",
                    "picture": {
                        "data": {
                            "is_silhouette": false,
                            "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c3.0.50.50/p50x50/1488150_587218951332359_2126798635_n.jpg?oh=ac0753459bc95d014997b1465bf9889c&oe=58E4EC54"
                        }
                    }
                }]
            };

            request(serverIp)
                .post("/facebook-sources")
                .send({
                    "userName": "test",
                    "keyword": "Times of india",
                    "type": "page"
                })
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedData);
                    done();
                });
        });
    });
});
