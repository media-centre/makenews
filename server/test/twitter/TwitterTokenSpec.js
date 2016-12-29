import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import TwitterToken from "../../src/twitter/TwitterToken";
import LogTestHelper from "../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterToken", () => {
    describe("isPresent", () => {
        let authSession = "test_authSession", adminDbMock = null, adminDbInstance = null, sandbox = null, appConfigMock = null;
        beforeEach("isPresent", () => {
            sandbox = sinon.sandbox.create();
            let adminDetails = {
                "adminDetails": {
                    "username": "test",
                    "password": "password",
                    "db": "test"
                }
            };
            let appConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(appConfig);
            appConfigMock = sandbox.mock(appConfig).expects("adminDetails");
            appConfigMock.returns({ adminDetails });
            adminDbInstance = new AdminDbClient();
            adminDbMock = sandbox.mock(AdminDbClient).expects("instance").withExactArgs(adminDetails.username, adminDetails.password, adminDetails.db);
            adminDbMock.returns(Promise.resolve(adminDbInstance));
            let couchClient = new CouchClient();
            sandbox.stub(CouchClient, "createInstance").withArgs(authSession).returns(Promise.resolve(couchClient));
            sandbox.mock(couchClient).expects("getUserName").returns(Promise.resolve(adminDetails.username));
            sandbox.stub(TwitterToken, "logger").returns(LogTestHelper.instance());
        });
        afterEach("isPresent", () => {
            sandbox.restore();
        });

        it("should return authenticated as true when document is present in database", async() => {
            let document = {
                "access_token": "test_token",
                "token_type": "test_type",
                "expires_in": 12345,
                "expired_after": 123456
            };
            let getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.resolve(document));
            let twitterToken = new TwitterToken();
            try {
                let authenticated = await twitterToken.isPresent(authSession);
                assert.strictEqual(authenticated, true);
                getDocumentMock.verify();
                appConfigMock.verify();
                adminDbMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should return authenticated as false when document is not present in database", async() => {
            let getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.reject("no document in db"));
            let facebookTokenDocument = new TwitterToken();
            try {
                let authenticated = await facebookTokenDocument.isPresent(authSession);
                assert.strictEqual(authenticated, false);
                appConfigMock.verify();
                adminDbMock.verify();
                getDocumentMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });
    });
});
