import MarkVisitedUserRoute from "../../../src/routes/helpers/MarkVisitedUserRoute";
import * as UserRequest from "../../../src/login/UserRequest";
import sinon from "sinon";
import { assert } from "chai";
import { isRejected } from "./../../helpers/AsyncTestHelper";

describe("MarkVisitedUser Route", () => {
    let sandbox = null;
    const username = "testUser";
    beforeEach("MarkVisitedUser Route", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("MarkVisitedUser Route", () => {
        sandbox.restore();
    });

    it("should validate username", async () => {
        let result = await new MarkVisitedUserRoute({
            "body": {
                username
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).validate();

        assert.equal(result, "");
    });

    it("should validate id and give a message if id is not there", async () => {
        let result = await new MarkVisitedUserRoute({
            "body": { },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).validate();

        assert.equal(result, "missing parameters");
    });

    it("should mark the user as visited", async () => {
        sandbox.mock(UserRequest).expects("markAsVisitedUser").returns(Promise.resolve({ "ok": true }));
        const result = await new MarkVisitedUserRoute({
            "body": {
                username
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).handle();
        assert.deepEqual(result, { "ok": true });
    });

    it("should throw an error if mark user as visited fails", async () => {
        sandbox.mock(UserRequest).expects("markAsVisitedUser").returns(Promise.reject("Not able to update"));
        const addStory = new MarkVisitedUserRoute({
            "body": {
                username
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {});
        
        await isRejected(addStory.handle(), "Not able to update");
    });
});
