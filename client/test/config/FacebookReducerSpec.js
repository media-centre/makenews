import { FACEBOOK_SEARCH_SOURCES } from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookUrls } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {
    it("should return an empty list by default when asked facebook sources", () => {
        expect([]).to.deep.equal(facebookUrls());
    });
    
    it("should add the new keyword to the list and return it", () => {
        let state = [{ "name": "Profile" }];
        let action = { "type": FACEBOOK_SEARCH_SOURCES, "keyword": "Profile2" };
        expect(facebookUrls(state, action)).to.deep.equal([{ "name": "Profile" }, { "name": "Profile2" }]);
    });
});
