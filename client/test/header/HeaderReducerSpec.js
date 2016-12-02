import { currentHeaderTab } from "../../src/js/header/HeaderReducer";
import { expect } from "chai";

describe("Header Reducer", () => {
    it("should return action with type and actions of scan news ", () => {
        expect(currentHeaderTab()).to.equals("SCAN_NEWS");
    });

    it("should return action with type and actions of write a story ", () => {
        let action = { "type": "WRITE_A_STORY", "currentHeaderTab": "WRITE_A_STORY" };
        expect(currentHeaderTab({}, action)).to.equals("WRITE_A_STORY");
    });
});
