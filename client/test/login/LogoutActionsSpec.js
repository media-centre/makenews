"use strict";

import { logout } from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage.js";
import DbSession from "../../src/js/db/DbSession.js";
import sinon from "sinon";

describe("userLogout", () => {
    it("should send the request to logout", () => {
        let sandbox = sinon.sandbox.create();
        let ajaxGetMock = sandbox.mock(AjaxClient.prototype).expects("get");
        let appSessionStorage = new AppSessionStorage();
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        let dbSessionClearInstanceMock = sandbox.mock(DbSession).expects("clearInstance");
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));
        logout();
        appSessionStorageClearMock.verify();
        ajaxGetMock.verify();
        dbSessionClearInstanceMock.verify();
        sandbox.restore();
    });
});
