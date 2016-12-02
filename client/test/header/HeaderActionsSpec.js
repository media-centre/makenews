import * as HeaderActions from "../../src/js/header/HeaderActions";
import { expect } from "chai";

describe("HeaderActions", () => {
    it("should return type and action", () => {
        let currentTab = "test";
        let tabSwitch = HeaderActions.getCurrentHeaderTab(currentTab);

        expect(tabSwitch.type).to.equal(currentTab);
        expect(tabSwitch.currentHeaderTab).to.equal(currentTab);
    });
});
