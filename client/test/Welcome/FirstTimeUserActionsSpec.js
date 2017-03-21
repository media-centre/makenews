import { markAsVisitedUser } from "../../src/js/welcome/FirstTimeUserActions";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import sinon from "sinon";
import History from "./../../src/js/History";

describe("FirstTimeUser", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("FirstTimeUser", () => {
        sandbox.restore();
    });

    it("should return success response", async() => {
        const expectedResponse = { "ok": true };
        const ajaxClientInstance = new AjaxClient();

        sandbox.mock(AjaxClient).expects("instance").withExactArgs("/visited-user", true).returns(ajaxClientInstance);
        const putMock = sandbox.mock(ajaxClientInstance).expects("put").returns(expectedResponse);

        await markAsVisitedUser();

        putMock.verify();
    });

    it("should redirect to the /configure/web after marking user as visited", async () => {
        const expectedResponse = { "ok": true };
        const ajaxClientInstance = new AjaxClient();

        sandbox.mock(AjaxClient).expects("instance").withExactArgs("/visited-user", true).returns(ajaxClientInstance);
        sandbox.mock(ajaxClientInstance).expects("put").returns(expectedResponse);
        
        const history = History.getHistory();
        sandbox.stub(History, "getHistory").returns(history);
        const historyPushMock = sandbox.mock(history).expects("push").withExactArgs("/configure/web");

        await markAsVisitedUser();

        historyPushMock.verify();
    });
});
