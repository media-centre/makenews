import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import FacebookTokenDocument, { getAdminDBInstance, getUserDocumentId } from "../../src/facebook/FacebookTokenDocument";
import LogTestHelper from "../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";
import { userDetails } from "./../../src/Factory";

let sandbox = null, authSession = "test_authSession", userName = "test";
describe("FacebookTokenDocument", () => {
    beforeEach("FacebookTokenDocument", () => {
        sandbox = sinon.sandbox.create();
        let userDetailsMock = sandbox.mock(userDetails).expects("getUser");
        userDetailsMock.withArgs(authSession).returns({ userName });
    });

    afterEach("FacebookTokenDocument", () => {
        sandbox.restore();
    });

    describe("GetTokenExpiresTime", () => {
        let adminDbMock = null, adminDbInstance = null, appConfigMock = null;
        beforeEach("GetTokenExpiresTime", () => {
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
            sandbox.stub(CouchClient, "instance").withArgs(authSession).returns(couchClient);
            sandbox.mock(couchClient).expects("getUserName").returns(Promise.resolve(adminDetails.username));
            sandbox.stub(FacebookTokenDocument, "logger").returns(LogTestHelper.instance());
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

    describe("getAdminDBInstance", () => {
        let appConfigMock = null, adminDbInstance = null, adminDbMock = null, adminDetails = null;

        beforeEach("getAdminDBInstance", () => {
            adminDetails = {
                "adminDetails": {
                    "username": "test",
                    "password": "password",
                    "db": "test"
                }
            };
        });

        it("should get admin db instance", async () => {
            let appConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(appConfig);
            appConfigMock = sandbox.mock(appConfig).expects("adminDetails");
            appConfigMock.returns({ adminDetails });
            adminDbInstance = new AdminDbClient();
            adminDbMock = sandbox.mock(AdminDbClient).expects("instance").withExactArgs(adminDetails.username, adminDetails.password, adminDetails.db);
            adminDbMock.returns(Promise.resolve(adminDbInstance));
            await getAdminDBInstance();
            appConfigMock.verify();
            adminDbMock.verify();
        });
    });

    describe("GetUserDocument", () => {
        it("should get the user document for given user authSession", async () => {

            let facebookId = "_facebookToken";
            let documentId = await getUserDocumentId(authSession, facebookId);
            assert.equal(documentId, userName + "_facebookToken");
        });
    });
});
