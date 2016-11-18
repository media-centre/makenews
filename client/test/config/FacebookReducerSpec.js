import { FACEBOOK_GOT_PROFILES } from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookProfiles } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {
    it("should return an empty list by default when asked facebook sources", () => {
        expect([]).to.deep.equal(facebookProfiles());
    });
    
    it("should add the new keyword to the list and return it", () => {
        let state = [{ "name": "Profile" }];
        let action = { "type": FACEBOOK_GOT_PROFILES, "keyword": "Profile2" };
        expect(facebookProfiles(state, action)).to.deep.equal([{ "name": "Profile" }, { "name": "Profile2" }]);
    });
});
