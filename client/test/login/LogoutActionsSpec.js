"use strict";

import { logout } from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage.js";
import sinon from "sinon";

describe("userLogout", () => {
    it("should send the request to logout", () => {
        let sandbox = sinon.sandbox.create();
        let ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));
        let appSessionStorage = new AppSessionStorage();
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        logout();
        appSessionStorageClearMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
    });
});
