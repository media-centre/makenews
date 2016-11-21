import { FACEBOOK_GOT_PROFILES, FACEBOOK_ADD_PROFILE } from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookProfiles, facebookConfiguredUrls } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {

    describe("Facebook Configured Sources", () => {
        it("should return an empty list by default when there are no configured sources", () => {
            expect(facebookConfiguredUrls().profiles).to.deep.equal([]);
            expect(facebookConfiguredUrls().groups).to.deep.equal([]);
            expect(facebookConfiguredUrls().pages).to.deep.equal([]);
        });

        it("should add a profile to the state when asked for adding a profile", () => {
            let action = { "type": FACEBOOK_ADD_PROFILE, "profile": { "name": "Profile1" } };
            let state = { "profiles": [], "pages": [], "groups": [] };
            expect(facebookConfiguredUrls(state, action).profiles).to.deep.equal([{ "name": "Profile1" }]);
        });
    });

    describe("Facebook Profiles", () => {
        it("should return an empty list by default when asked facebook sources", () => {
            expect([]).to.deep.equal(facebookProfiles());
        });

        it("should return the list of profiles when it got the profiles", () => {
            let profiles = [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }];
            let action = { "type": FACEBOOK_GOT_PROFILES, "profiles": profiles };
            expect(facebookProfiles([], action)).to.deep.equal(profiles);
        });

        it("should add the added property to the source", () => {
            let state = [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }];
            let action = { "type": FACEBOOK_ADD_PROFILE, "profile": { "id": 1, "name": "Profile" } };
            expect(facebookProfiles(state, action)).to.deep.equal([{ "id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });
    });
});
