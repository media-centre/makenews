import { currentHeaderTab, popUp } from "../../src/js/header/HeaderReducer";
import { expect } from "chai";

describe("Header Reducer", () => {
    it("should return action with type and actions of scan news ", () => {
        expect(currentHeaderTab()).to.equals("Scan News");
    });

    it("should return action with type and actions of write a story ", () => {
        const action = { "type": "Write a Story", "currentHeaderTab": "Write a Story" };
        expect(currentHeaderTab({}, action)).to.equals("Write a Story");
    });

    describe("popup", () => {
        const message = "message";
        const callback = () => {};
        const hide = false;
        const action = { "type": "POP_UP", message, callback, hide };

        expect(popUp({}, action)).to.deep.equals({ message, callback, hide });
    });
});
