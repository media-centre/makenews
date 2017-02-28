import LogoutActions from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import sinon from "sinon";

describe("LogoutActions", () => {
    it("should send the request to logout", () => {
        let sandbox = sinon.sandbox.create();
        let ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        let appSessionStorage = new AppSessionStorage();
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));
        LogoutActions.instance().logout();
        appSessionStorageClearMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
    });
});
