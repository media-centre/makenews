import { twitterTokenInformation, twitterAuthentication, TWITTER_AUTHENTICATION } from "./../../src/js/twitter/TwitterTokenActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("Twitter Actions", () => {
    describe("twitterTokenInformation", () => {
        it("it should return the action type and twitterAuthenticated value", () => {
            const twitterAuthenticated = true;
            const action = {
                "type": TWITTER_AUTHENTICATION,
                "twitterAuthenticated": twitterAuthenticated
            };
            const result = twitterTokenInformation(twitterAuthenticated);
            assert.strictEqual(result.type, action.type);
            assert.strictEqual(result.twitterAuthenticated, action.twitterAuthenticated);
        });
    });

    describe("twitterAuthentication", () => {
        let sandbox = null;
        let ajaxClient = null;
        let ajaxGetmock = null;
        beforeEach("twitterAuthentication", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/twitter-token", false);
            sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
        });

        afterEach("twitterAuthentication", () => {
            sandbox.restore();
        });

        it("should get the twitter authentication as true from the server", (done) => {
            const twitterAuthenticated = true;
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.resolve({ "twitterAuthenticated": twitterAuthenticated }));
            const store = mockStore([], [{ "type": TWITTER_AUTHENTICATION, "twitterAuthenticated": twitterAuthenticated }], done);
            twitterAuthentication().then(func => {
                store.dispatch(func);
                ajaxGetmock.verify();
            });
        });

        it("should get the twitter authentication as false from the server", (done) => {
            const twitterAuthenticated = false;
            ajaxGetmock = sandbox.mock(ajaxClient).expects("get").returns(Promise.reject({ "status": "badRequest" }));
            const store = mockStore([], [{ "type": TWITTER_AUTHENTICATION, "twitterAuthenticated": twitterAuthenticated }], done);
            twitterAuthentication().then(func => {
                store.dispatch(func);
                ajaxGetmock.verify();
            });
        });
    });
});
