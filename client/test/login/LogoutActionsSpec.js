import LogoutActions from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import sinon from "sinon";

describe("LogoutActions", () => {
    it("should send the request to logout", () => {
        let sandbox = sinon.sandbox.create();
        let ajaxDelete = AjaxClient.instance("/delete-hashtag-feeds");
        let ajaxMock = sandbox.mock(AjaxClient).expects("instance").twice().returns(ajaxDelete);
        let ajaxDeleteFeeds = sandbox.mock(ajaxDelete).expects("get").twice().returns(Promise.resolve());
        let appSessionStorage = new AppSessionStorage();
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        LogoutActions.instance().logout();
        appSessionStorageClearMock.verify();
        ajaxMock.verify();
        ajaxDeleteFeeds.verify();
        sandbox.restore();
    });
});
