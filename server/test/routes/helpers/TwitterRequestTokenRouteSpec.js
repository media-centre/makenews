/*eslint max-nested-callbacks:0*/

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterRequestTokenRoute from "../../../src/routes/helpers/TwitterRequestTokenRoute";
import TwitterLogin from "../../../src/twitter/TwitterLogin";
import sinon from "sinon";
import { expect } from "chai";

describe("TwitterRequestTokenRouteSpec", () => {
    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should redirect to authenticate with requestToken", () => {
            const twitterLogin = new TwitterLogin();
            const token = "token";
            const expectedUrl = "https://api.twitter.com/oauth/authenticate?oauth_token=" + token;
            const clientCallbackUrl = "clientUrl";
            const serverCallbackUrl = "serverUrl";
            twitterLogin.oauthToken = token;
            sandbox.stub(TwitterLogin, "instance")
                .withArgs({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl })
                .returns(Promise.resolve(twitterLogin));
            let actualStatus = null;
            let actualMessage = null;
            const response = {
                "status": status => {
                    actualStatus = status;
                },
                "json": message => {
                    actualMessage = message;
                }
            };
            const request = {
                "query": {
                    "clientCallbackUrl": clientCallbackUrl,
                    "serverCallbackUrl": serverCallbackUrl,
                    "userName": "Maharjun"
                }
            };
            new TwitterRequestTokenRoute(request, response).handle();

            return Promise.resolve().then(() => {
                expect(actualStatus).to.equals(HttpResponseHandler.codes.OK);
                expect(actualMessage).to.deep.equals({ "authenticateUrl": expectedUrl });
            });
        });

        it("should log the error message if request token fetching failed", (done) => {
            let actualStatus = null;
            let actualMessage = null;
            const response = {
                "status": status => {
                    actualStatus = status;
                },
                "json": message => {
                    actualMessage = message;
                }
            };
            const clientCallbackUrl = "clientUrl";
            const serverCallbackUrl = "serverUrl";
            const request = {
                "query": {
                    "clientCallbackUrl": clientCallbackUrl,
                    "serverCallbackUrl": serverCallbackUrl,
                    "userName": "Maharjun"
                }
            };
            sandbox.mock(TwitterLogin).expects("instance")
                .withArgs({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl })
                .returns(Promise.reject({
                    "getOauthToken": () => {}
                }));

            new TwitterRequestTokenRoute(request, response).handle();

            setImmediate(() => {
                expect(actualStatus).to.equals(HttpResponseHandler.codes.BAD_REQUEST);
                expect(actualMessage).to.deep.equals({ "message": "Unable to fetch the twitter request token" });
                done();
            });
        });
    });
});
