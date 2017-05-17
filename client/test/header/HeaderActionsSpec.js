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
    });

    it("should return message and type for popUp", () => {
        const message = "message";
        const callback = () => {};
        const result = HeaderActions.popUp(message, callback);

        expect(result.type).to.equal("POP_UP");
        expect(result.message).to.equal(message);
        expect(result.callback).to.equal(callback);
    });
});
