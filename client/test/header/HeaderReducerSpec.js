import { currentHeaderTab } from "../../src/js/header/HeaderReducer";
import { expect } from "chai";

describe("Header Reducer", () => {
    it("should return action with type and actions of scan news ", () => {
        expect(currentHeaderTab()).to.equals("Scan News");
    });

    it("should return action with type and actions of write a story ", () => {
        let action = { "type": "Write a Story", "currentHeaderTab": "Write a Story" };
        expect(currentHeaderTab({}, action)).to.equals("Write a Story");
    });
});
