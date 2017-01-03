import { addUrlMessage } from "./../../src/js/config/reducers/AddUrlReducer";
import { expect } from "chai";

describe("AddUrl Reducer", () => {
    it("should return action with type of Message ", () => {
        let action = { "type": "RSS_ADD_URL_STATUS", "status": { "message": "success", "added": true } };
        expect(addUrlMessage({}, action)).to.deep.equals({ "message": "success", "added": true });
    });
    it("should have empty string in defalt case ", () => {
        expect(addUrlMessage()).to.deep.equals({ "message": "", "added": false });
    });
});
