import * as HeaderActions from "../../src/js/header/HeaderActions";
import { expect } from "chai";

describe("HeaderActions", () => {
    it("should return type and action", () => {
        let currentTab = "test";
        let tabSwitch = HeaderActions.setCurrentHeaderTab(currentTab);

        expect(tabSwitch.type).to.equal(currentTab);
        expect(tabSwitch.currentHeaderTab).to.equal(currentTab);
    });

    it("should return default message and type for popUp", () => {
        const result = HeaderActions.popUp();

        expect(result.type).to.equal("POP_UP");
        expect(result.message).to.equal("");
        expect(result.hide).to.equal(false);
    });

    it("should return message and type for popUp", () => {
        const message = "message";
        const callback = () => {};
        const hide = true;
        const result = HeaderActions.popUp(message, callback, hide);

        expect(result.type).to.equal("POP_UP");
        expect(result.message).to.equal(message);
        expect(result.callback).to.equal(callback);
        expect(result.hide).to.equal(hide);
    });
});
