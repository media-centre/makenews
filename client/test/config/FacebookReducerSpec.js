import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    GOT_CONFIGURED_SOURCES,
    FACEBOOK_CHANGE_CURRENT_TAB,
    PAGES
} from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookSources, configuredSources, facebookCurrentSourceTab } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {

    describe("Facebook Configured Sources", () => {
        it("should return an empty list by default when there are no configured sources", () => {
            expect(configuredSources().profiles).to.deep.equal([]);
            expect(configuredSources().groups).to.deep.equal([]);
            expect(configuredSources().pages).to.deep.equal([]);
        });

        it("should add a profile to the state when asked for adding a profile", () => {
            let action = { "type": FACEBOOK_ADD_PROFILE, "source": { "name": "Profile1" } };
            let state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1" }]);
        });

        it("should add a page to the state when asked for adding a page", () => {
            let action = { "type": FACEBOOK_ADD_PAGE, "source": { "name": "Page1" } };
            let state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
            expect(configuredSources(state, action).pages).to.deep.equal([{ "name": "Page1" }]);
        });

        it("should add a group to the state when asked for adding a group", () => {
            let action = { "type": FACEBOOK_ADD_GROUP, "source": { "name": "Group1" } };
            let state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
            expect(configuredSources(state, action).groups).to.deep.equal([{ "name": "Group1" }]);
        });

        it("should return updated state with configured profiles", () => {
            let sources = { "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };
            let action = { "type": GOT_CONFIGURED_SOURCES, "sources": sources };
            let state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1" }, { "name": "Profile2" }]);
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
            expect(facebookSources(state, action)).to.deep.equal([{ "_id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });

        it("should add the added=true property to the configured facebook page", () => {
            let state = [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }];
            let action = { "type": FACEBOOK_ADD_PAGE, "source": { "id": 1, "name": "Profile" } };
            expect(facebookSources(state, action)).to.deep.equal([{ "_id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });

        it("should add the added=true property to the configured facebook group", () => {
            let state = [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }];
            let action = { "type": FACEBOOK_ADD_GROUP, "source": { "id": 1, "name": "Group" } };
            expect(facebookSources(state, action)).to.deep.equal([{ "_id": 1, "added": true, "name": "Group" }, { "id": 2, "name": "Group2" }]);
        });
    });

    describe("Facebook current Tab", () => {
        it("should return Profiles as current tab by default", () => {
            expect(facebookCurrentSourceTab()).to.equal("Profiles");
        });

        it(`should return given currentTab when ${FACEBOOK_CHANGE_CURRENT_TAB} is dispatched`, () => {
            let action = { "type": FACEBOOK_CHANGE_CURRENT_TAB, "currentTab": PAGES };
            expect(facebookCurrentSourceTab("", action)).to.equal(PAGES);
        });
    });
});
