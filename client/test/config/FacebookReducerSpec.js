import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_GOT_CONFIGURED_PROFILES,
    FACEBOOK_CHANGE_CURRENT_TAB,
    PAGES
} from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookSources, facebookConfiguredUrls, facebookCurrentSourceTab } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {

    describe("Facebook Configured Sources", () => {
        it("should return an empty list by default when there are no configured sources", () => {
            expect(facebookConfiguredUrls().profiles).to.deep.equal([]);
            expect(facebookConfiguredUrls().groups).to.deep.equal([]);
            expect(facebookConfiguredUrls().pages).to.deep.equal([]);
        });

        it("should add a profile to the state when asked for adding a profile", () => {
            let action = { "type": FACEBOOK_ADD_PROFILE, "source": { "name": "Profile1" } };
            let state = { "profiles": [], "pages": [], "groups": [] };
            expect(facebookConfiguredUrls(state, action).profiles).to.deep.equal([{ "name": "Profile1" }]);
        });

        it("should add a profile to the state when asked for adding a page", () => {
            let action = { "type": FACEBOOK_ADD_PAGE, "source": { "name": "Page1" } };
            let state = { "profiles": [], "pages": [], "groups": [] };
            expect(facebookConfiguredUrls(state, action).pages).to.deep.equal([{ "name": "Page1" }]);
        });

        it("should return updated state with configured profiles", () => {
            let action = { "type": FACEBOOK_GOT_CONFIGURED_PROFILES, "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }] };
            let state = { "profiles": [], "pages": [], "groups": [] };
            expect(facebookConfiguredUrls(state, action).profiles).to.deep.equal([{ "name": "Profile1" }, { "name": "Profile2" }]);
        });
    });

    describe("Facebook Sources", () => {
        it("should return an empty list by default when asked facebook sources", () => {
            expect([]).to.deep.equal(facebookSources());
        });

        it("should return the list of profiles when it got the profiles", () => {
            let profiles = [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }];
            let action = { "type": FACEBOOK_GOT_SOURCES, "sources": profiles };
            expect(facebookSources([], action)).to.deep.equal(profiles);
        });

        it("should add the added=true property to the configured facebook profile", () => {
            let state = [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }];
            let action = { "type": FACEBOOK_ADD_PROFILE, "source": { "id": 1, "name": "Profile" } };
            expect(facebookSources(state, action)).to.deep.equal([{ "id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });

        it("should add the added=true property to the configured facebook page", () => {
            let state = [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }];
            let action = { "type": FACEBOOK_ADD_PAGE, "source": { "id": 1, "name": "Profile" } };
            expect(facebookSources(state, action)).to.deep.equal([{ "id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });
    });

    describe("Facebook current Tab", () => {
        it("should return Profiles as current tab by default", () => {
            expect(facebookCurrentSourceTab()).to.equal("Profiles");
        });

        it("should return Pages when the current tab changed to Pages", () => {
            let action = { "type": FACEBOOK_CHANGE_CURRENT_TAB, "currentTab": PAGES };
            expect(facebookCurrentSourceTab([], action)).to.equal(PAGES);
        });
    });
});
