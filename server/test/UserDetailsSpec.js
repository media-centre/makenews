import UserDetails from "../src/UserDetails";
import CryptUtil from "../src/util/CryptUtil";
import { assert } from "chai";
import sinon from "sinon";

describe("UserDetails", () => {
    let dbHashStub = null, sandbox = sinon.sandbox.create();
    beforeEach("", () => {
        dbHashStub = sandbox.stub(CryptUtil, "dbNameHash");
    });

    afterEach("", () => {
        sandbox.restore();
    });
    it("getUser with no users", () => {
        let userDetails = new UserDetails();
        assert.deepEqual(userDetails.getUser("token1"), {});
    });

    it("getUser with single user", () => {
        let userDetails = new UserDetails();
        let userName = "test1", dbName = "db1";
        dbHashStub.withArgs(userName).returns(dbName);
        userDetails.updateUser("token1", userName);
        assert.deepEqual(userDetails.getUser("token1"), { userName, dbName });
    });

    it("getUser with multiple users", () => {
        let userDetails = new UserDetails();
        dbHashStub.withArgs("test1").returns("db1");
        userDetails.updateUser("token1", "test1");
        dbHashStub.withArgs("test2").returns("db2");
        userDetails.updateUser("token2", "test2");
        dbHashStub.withArgs("test3").returns("db3");
        userDetails.updateUser("token3", "test3");
        assert.deepEqual(userDetails.getUser("token2"), { "userName": "test2", "dbName": "db2" });
    });

    it("getUser with user doesn't exist", () => {
        let userDetails = new UserDetails();
        assert.deepEqual(userDetails.getUser("token1"), {});
    });

    it("removeUser", () => {
        let userDetails = new UserDetails();
        let userName = "test1", dbName = "db1";
        dbHashStub.withArgs(userName).returns(dbName);
        userDetails.updateUser("token1", userName);
        assert.deepEqual(userDetails.getUser("token1"), { userName, dbName });
        userDetails.removeUser("token1");
        assert.deepEqual(userDetails.getUser("token1"), {});
    });
});
