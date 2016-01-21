/* eslint max-nested-callbacks: [2, 5]*/

"use strict";
import FacebookAccessToken from "../../src/facebook/FacebookAccessToken";
import AdminDbClient from "../../src/db/AdminDbClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookAccessToken", () => {
    let sandbox = null, token = "12345", userName = "test1", tokenDocId = userName + "_facebookToken";
    beforeEach("FacebookAccessToken", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("FacebookAccessToken", () => {
        sandbox.restore();
    });

    describe("getAccesToken", () => {

        it("should get token from db and returns", (done) => {
            let adminDbClient = new AdminDbClient();
            sandbox.stub(AdminDbClient, "instance").returns(adminDbClient);
            sandbox.stub(adminDbClient, "getDocument").withArgs(tokenDocId).returns(Promise.resolve({ "access_token": token }));

            FacebookAccessToken.instance().getAccessToken(userName).then((response) => {
                assert.deepEqual(response, token);
                done();
            });
        });

        it("error should thrown if facebook token document is not present", (done) => {
            let adminDbClient = new AdminDbClient();
            sandbox.stub(AdminDbClient, "instance").returns(adminDbClient);
            sandbox.stub(adminDbClient, "getDocument").withArgs(tokenDocId).returns(Promise.reject());

            FacebookAccessToken.instance().getAccessToken(userName).catch((error) => {
                assert.strictEqual(error, "access token not there");
                done();
            });
        });
    });
});
