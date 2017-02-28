import LogoutActions from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import sinon from "sinon";

describe("LogoutActions", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("LogoutActions", () => {
        sandbox.restore();
    });

    it("should send the request to logout", () => {
        let ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        let appSessionStorage = new AppSessionStorage();
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));

        LogoutActions.instance().logout();

        appSessionStorageClearMock.verify();
    });
});
