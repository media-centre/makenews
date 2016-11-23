import AppWindow from "../../src/js/utils/AppWindow";
import { assert } from "chai";
import sinon from "sinon";

describe("AppWindow", () => {
    it("should get value which is set on window", () => {
        let appWindow = AppWindow.instance();
        let obj = {};
        sinon.stub(appWindow, "getWindow").returns(obj);
        appWindow.set("test", "123");
        assert.strictEqual(appWindow.get("test"), "123");
    });
});
