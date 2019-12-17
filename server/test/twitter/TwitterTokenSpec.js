import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import TwitterToken from "../../src/twitter/TwitterToken";
import LogTestHelper from "../helpers/LogTestHelper";
import { userDetails } from "./../../src/Factory";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterToken", () => {
    describe("isPresent", () => {
        const authSession = "test_authSession";
        let adminDbMock = null;
        let adminDbInstance = null;
        let sandbox = null;
        let appConfigMock = null;
        beforeEach("isPresent", () => {
            sandbox = sinon.sandbox.create();
            const adminDetails = {
                "adminDetails": {
                    "username": "test",
                    "password": "password",
                    "db": "test"
                }
            };
            const userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(authSession).returns({ "username": "test" });
            const appConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(appConfig);
            appConfigMock = sandbox.mock(appConfig).expects("adminDetails");
            appConfigMock.returns({ adminDetails });
            adminDbInstance = new AdminDbClient();
            adminDbMock = sandbox.mock(AdminDbClient).expects("instance").withExactArgs(adminDetails.username, adminDetails.password, adminDetails.db);
            adminDbMock.returns(Promise.resolve(adminDbInstance));
            const couchClient = new CouchClient();
            sandbox.stub(CouchClient, "createInstance").withArgs(authSession).returns(Promise.resolve(couchClient));
            sandbox.mock(couchClient).expects("getUserName").returns(Promise.resolve(adminDetails.username));
            sandbox.stub(TwitterToken, "logger").returns(LogTestHelper.instance());
        });
        afterEach("isPresent", () => {
            sandbox.restore();
        });

        it("should return authenticated as true when document is present in database", async() => {
            const document = {
                "access_token": "test_token",
                "token_type": "test_type",
                "expires_in": 12345,
                "expired_after": 123456
            };
            const getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.resolve(document));
            const twitterToken = new TwitterToken();
            try {
                const authenticated = await twitterToken.isPresent(authSession);
                assert.strictEqual(authenticated, true);
                getDocumentMock.verify();
                appConfigMock.verify();
                adminDbMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should return authenticated as false when document is not present in database", async() => {
            const getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.reject("no document in db"));
            const facebookTokenDocument = new TwitterToken();
            try {
                const authenticated = await facebookTokenDocument.isPresent(authSession);
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
