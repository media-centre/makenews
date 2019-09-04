import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import FacebookTokenDocument, { getAdminDBInstance, getUserDocumentId } from "../../src/facebook/FacebookTokenDocument";
import LogTestHelper from "../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";
import { userDetails } from "./../../src/Factory";
import DateUtil from "./../../src/util/DateUtil";

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

        it("should return false when the current time is less than the expires time", async() => {
            const document = {
                "access_token": "test_token",
                "token_type": "test_type",
                "expires_in": 123456,
                "expired_after": 1492322451462
            };
            const getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.resolve(document));
            const facebookTokenDocument = new FacebookTokenDocument();
            const currentTime = 1492312321232;
            sandbox.stub(DateUtil, "getCurrentTime").returns(currentTime);

            const isExpired = await facebookTokenDocument.isExpired(authSession);

            getDocumentMock.verify();
            appConfigMock.verify();
            adminDbMock.verify();
            assert.isFalse(isExpired);
        });

        it("should return true when the current time is greater then the expires time", async() => {
            const document = {
                "access_token": "test_token",
                "token_type": "test_type",
                "expires_in": 123456,
                "expired_after": 1491322451462
            };
            const getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.resolve(document));
            const facebookTokenDocument = new FacebookTokenDocument();
            const currentTime = 1492312321232;
            sandbox.stub(DateUtil, "getCurrentTime").returns(currentTime);

            const isExpired = await facebookTokenDocument.isExpired(authSession);

            getDocumentMock.verify();
            appConfigMock.verify();
            adminDbMock.verify();
            assert.isTrue(isExpired);
        });

        it("should return true when there is an error from getting info", async() => {
            let getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.reject("no document in db"));
            let facebookTokenDocument = new FacebookTokenDocument();

            const isExpired = await facebookTokenDocument.isExpired(authSession);

            appConfigMock.verify();
            adminDbMock.verify();
            getDocumentMock.verify();
            assert.isTrue(isExpired);
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

        it("should get admin db instance", async() => {
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
        it("should get the user document for given user authSession", async() => {

            let facebookId = "_facebookToken";
            let documentId = await getUserDocumentId(authSession, facebookId);
            assert.equal(documentId, userName + "_facebookToken");
        });
    });
});
