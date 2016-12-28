import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import FacebookTokenDocument from "../../src/facebook/FacebookTokenDocument";
import LogTestHelper from "../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("FacebookTokenDocument", () => {
    describe("GetTokenExpiresTime", () => {
        let authSession = "test_authSession", adminDbMock = null, adminDbInstance = null, sandbox = null, appConfigMock = null;
        beforeEach("GetTokenExpiresTime", () => {
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
            sandbox.stub(FacebookTokenDocument, "logger").returns(LogTestHelper.instance());
        });
        afterEach("GetExpiresTime", () => {
            sandbox.restore();
        });

        it("should get the expires time when document is present in database", async() => {
            let document = {
                "access_token": "test_token",
                "token_type": "test_type",
                "expires_in": 12345,
                "expired_after": 123456
            };
            let getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.resolve(document));
            let facebookTokenDocument = new FacebookTokenDocument();
            try {
                let expireTime = await facebookTokenDocument.getExpiredTime(authSession);
                assert.strictEqual(expireTime, document.expired_after);
                getDocumentMock.verify();
                appConfigMock.verify();
                adminDbMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should return 'ZERO' when document is not present in database", async() => {
            let ZERO = 0;
            let getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.reject("no document in db"));
            let facebookTokenDocument = new FacebookTokenDocument();
            try {
                let expireTime = await facebookTokenDocument.getExpiredTime(authSession);
                assert.strictEqual(expireTime, ZERO);
                appConfigMock.verify();
                adminDbMock.verify();
                getDocumentMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });
    });
});
