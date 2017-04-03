import { showAddUrl } from "./../../src/js/config/reducers/AddUrlReducer";
import { ADD_URL_STATUS } from "./../../src/js/config/actions/AddUrlActions";
import { expect } from "chai";

describe("AddUrl Reducer", () => {
    it("should return action with type of Message ", () => {
        const action = { "type": ADD_URL_STATUS, "status": true };
        expect(showAddUrl({}, action)).to.be.true; //eslint-disable-line no-unused-expressions
    });
    
    it("should have empty string in default case ", () => {
        expect(showAddUrl()).to.be.false; //eslint-disable-line no-unused-expressions
    });
});
