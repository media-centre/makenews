"use strict";

import { logout } from "../../src/js/login/LogoutActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";

describe("userLogout", () => {
    it("should send the request to logout", () => {
        let ajaxGetMock = sinon.mock(AjaxClient.prototype).expects("get");
        ajaxGetMock.returns(Promise.resolve({ "message": "logout successful" }));

        logout();

        ajaxGetMock.verify();
        AjaxClient.prototype.get.restore();
    });
});
