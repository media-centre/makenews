/* eslint max-nested-callbacks: [2, 5]*/

"use strict";
import FacebookAccessToken from "../../src/facebook/FacebookAccessToken";
import AdminDbClient from "../../src/db/AdminDbClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookAccessToken", () => {
    let sandbox = null, token = "12345";
    beforeEach("FacebookAccessToken", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("FacebookAccessToken", () => {
        sandbox.restore();
    });
    describe("getAccesToken", () => {
        it("if long lived token exists return existing token", (done) => {
            sandbox.stub(FacebookAccessToken, "getToken").returns(token);
            FacebookAccessToken.instance().getAccesToken().then((response) => {
                assert.deepEqual(response, token);
                done();
            });
        });

        it("if long lived token not exists then should get token from db and returns", (done) => {
            sandbox.stub(FacebookAccessToken, "getToken").returns(null);
            let adminDbClient = new AdminDbClient();
            sandbox.stub(AdminDbClient, "instance").returns(adminDbClient);
            sandbox.stub(adminDbClient, "getDocument").withArgs("facebookToken").returns(Promise.resolve({ "access_token": token }));

            FacebookAccessToken.instance().getAccesToken().then((response) => {
                assert.deepEqual(response, token);
                done();
            });
        });

        it("error should thrown if facebook token document is not present", (done) => {
            sandbox.stub(FacebookAccessToken, "getToken").returns(null);
            let adminDbClient = new AdminDbClient();
            sandbox.stub(AdminDbClient, "instance").returns(adminDbClient);
            sandbox.stub(adminDbClient, "getDocument").withArgs("facebookToken").returns(Promise.reject());

            FacebookAccessToken.instance().getAccesToken().catch((error) => {
                assert.strictEqual(error, "access token not there");
                done();
            });
        });
    });
});
