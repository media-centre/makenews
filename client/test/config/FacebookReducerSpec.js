import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_CHANGE_CURRENT_TAB,
    PAGES
} from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookSources, facebookCurrentSourceTab } from "../../src/js/config/reducers/FacebookReducer";
import { expect } from "chai";

describe("Facebook Reducer", () => {
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
