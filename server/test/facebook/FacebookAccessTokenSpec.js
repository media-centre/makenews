/* eslint max-nested-callbacks: [2, 5]*/


import FacebookAccessToken from "../../src/facebook/FacebookAccessToken";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookAccessToken", () => {
    let sandbox = null, token = "12345", userName = "test1", tokenDocId = userName + "_facebookToken";
    beforeEach("FacebookAccessToken", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(FacebookAccessToken, "logger").returns(LogTestHelper.instance());
        let applicationConfig = new ApplicationConfig();
        sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sandbox.stub(applicationConfig, "adminDetails").returns({
            "username": "adminUser",
            "password": "adminPwd",
            "db": "adminDb"
        });
    });

    afterEach("FacebookAccessToken", () => {
        sandbox.restore();
    });

    describe("getAccesToken", () => {

        it("should get token from db and returns", (done) => {
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(tokenDocId).returns(Promise.resolve({ "access_token": token }));
            sandbox.stub(AdminDbClient, "instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));

            FacebookAccessToken.instance().getAccessToken(userName).then((response) => {
                assert.deepEqual(response, token);
                done();
            });
        });

        it("error should thrown if facebook token document is not present", (done) => {
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(tokenDocId).returns(Promise.reject());
            sandbox.stub(AdminDbClient, "instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));

            FacebookAccessToken.instance().getAccessToken(userName).catch((error) => {
                assert.strictEqual(error, "access token not there");
                done();
            });
        });
    });
});
