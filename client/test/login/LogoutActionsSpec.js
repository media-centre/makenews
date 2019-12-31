import LogoutActions from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { expect } from "chai";
import History from "../../src/js/History";

describe("LogoutActions", () => {
    const sandbox = sinon.sandbox.create();
    let originalWindowLocation = null;

    beforeEach("LogoutActions", () => {
        originalWindowLocation = window.location;
        Object.defineProperty(window, "location", {
            "value": {
                "reload": sandbox.spy()
            },
            "writable": true
        });
    });

    afterEach("LogoutActions", () => {
        sandbox.restore();
        window.location = originalWindowLocation;
    });

    it("should send the request to logout", () => {
        const ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));
        sandbox.stub(History, "getHistory").returns({
            "push": sandbox.spy()
        });

        LogoutActions.instance().logout();

        ajaxGetMock.verify();

        expect(window.location.reload.called).to.be.true; // eslint-disable-line no-unused-expressions
        expect(History.getHistory().push.args[0][0]).to.equal("/");// eslint-disable-line no-magic-numbers
    });
});
