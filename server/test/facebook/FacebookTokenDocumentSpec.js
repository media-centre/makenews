import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import FacebookTokenDocument, { getAdminDBInstance, getUserDocumentId } from "../../src/facebook/FacebookTokenDocument";
import LogTestHelper from "../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";
import { userDetails } from "./../../src/Factory";
import DateUtil from "./../../src/util/DateUtil";

let sandbox = null;
const authSession = "test_authSession";
const userName = "test";
describe("FacebookTokenDocument", () => {
    beforeEach("FacebookTokenDocument", () => {
        sandbox = sinon.sandbox.create();
        const userDetailsMock = sandbox.mock(userDetails).expects("getUser");
        userDetailsMock.withArgs(authSession).returns({ userName });
    });

    afterEach("FacebookTokenDocument", () => {
        sandbox.restore();
    });

    describe("GetTokenExpiresTime", () => {
        let adminDbMock = null;
        let adminDbInstance = null;
        let appConfigMock = null;
        beforeEach("GetTokenExpiresTime", () => {
            const adminDetails = {
                "adminDetails": {
                    "username": "test",
                    "password": "password",
                    "db": "test"
                }
            };
            const appConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(appConfig);
            appConfigMock = sandbox.mock(appConfig).expects("adminDetails");
            appConfigMock.returns({ adminDetails });
            adminDbInstance = new AdminDbClient();
            adminDbMock = sandbox.mock(AdminDbClient).expects("instance").withExactArgs(adminDetails.username, adminDetails.password, adminDetails.db);
            adminDbMock.returns(Promise.resolve(adminDbInstance));
            const couchClient = new CouchClient();
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
            const getDocumentMock = sandbox.mock(adminDbInstance).expects("getDocument");
            getDocumentMock.returns(Promise.reject("no document in db"));
            const facebookTokenDocument = new FacebookTokenDocument();

            const isExpired = await facebookTokenDocument.isExpired(authSession);

            appConfigMock.verify();
            adminDbMock.verify();
            getDocumentMock.verify();
            assert.isTrue(isExpired);
        });
    });

    describe("getAdminDBInstance", () => {
        let appConfigMock = null;
        let adminDbInstance = null;
        let adminDbMock = null;
        let adminDetails = null;

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
            const appConfig = new ApplicationConfig();
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

            const facebookId = "_facebookToken";
            const documentId = await getUserDocumentId(authSession, facebookId);
            assert.equal(documentId, userName + "_facebookToken");
        });
    });
});
