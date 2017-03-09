import { addUrlMessage } from "./../../src/js/config/reducers/AddUrlReducer";
import { expect } from "chai";

describe("AddUrl Reducer", () => {
    it("should return action with type of Message ", () => {
        const action = { "type": "RSS_ADD_URL_STATUS", "status": { "added": true } };
        expect(addUrlMessage({}, action)).to.deep.equals({ "added": true });
    });
    
    it("should have empty string in defalt case ", () => {
        expect(addUrlMessage()).to.deep.equals({ "added": false });
    });
});
