import LogoutActions from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";

describe("LogoutActions", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("LogoutActions", () => {
        sandbox.restore();
    });

    it("should send the request to logout", () => {
        const ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));

        LogoutActions.instance().logout();

        ajaxGetMock.verify();
    });
});
