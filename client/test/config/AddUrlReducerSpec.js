import { addUrlMessage } from "./../../src/js/config/reducers/AddUrlReducer";
import { expect } from "chai";

describe("AddUrl Reducer", () => {
    it("should return action with type of Message ", () => {
        let action = { "type": "MESSAGE", "message": "something" };
        expect(addUrlMessage({}, action)).to.equals("something");
    });
    it("should have empty string in defalt case ", () => {
        expect(addUrlMessage()).to.equals("");
    });
});
