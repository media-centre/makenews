import { markAsVisitedUser } from "../../src/js/welcome/FirstTimeUserActions";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import sinon from "sinon";
import AppSessionStorage from "./../../src/js/utils/AppSessionStorage";

describe("FirstTimeUser", () => {
    const sandbox = sinon.sandbox.create();
    const sessionStorage = AppSessionStorage.instance();

    afterEach("FirstTimeUser", () => {
        sandbox.restore();
    });

    it("should remove first time user in the session storage on success response", async() => {
        const expectedResponse = { "ok": true };
        const ajaxClientInstance = new AjaxClient();

        sandbox.mock(AjaxClient).expects("instance").withExactArgs("/visited-user", true).returns(ajaxClientInstance);
        const putMock = sandbox.mock(ajaxClientInstance).expects("put").returns(expectedResponse);

        sandbox.mock(AppSessionStorage).expects("instance").returns(sessionStorage);
        const removeMock = sandbox.mock(sessionStorage).expects("remove")
            .withExactArgs(AppSessionStorage.KEYS.FIRST_TIME_USER);

        await markAsVisitedUser();

        putMock.verify();
        removeMock.verify();
    });
});
