import {
    FACEBOOK_GOT_SOURCES,
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP
} from "../../src/js/config/actions/FacebookConfigureActions";
import { facebookSources } from "../../src/js/config/reducers/FacebookReducer";
import { CLEAR_SOURCES } from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { expect } from "chai";

describe("Facebook Reducer", () => {
    describe("Facebook Sources", () => {
        it("should return an empty list by default when asked facebook sources", () => {
            expect({ "data": [], "nextPage": {} }).to.deep.equal(facebookSources());
        });

        it("should return the list of sources when it got the sources", () => {
            let sources = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            let action = { "type": FACEBOOK_GOT_SOURCES, "sources": sources };
            let state = facebookSources([], action);
            expect(state.data).to.deep.equal(sources.data);
            expect(state.nextPage).to.deep.equal(sources.paging);
        });

        it("should add the added=true property to the configured facebook profile", () => {
            let state = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "id": 1, "name": "Profile" }] };
            expect(facebookSources(state, action).data).to.deep.equal(
                [{ "_id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });

        it("should add the added=true property to the configured facebook page", () => {
            let state = { "data": [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "id": 1, "name": "Page" }] };
            expect(facebookSources(state, action).data).to.deep.equal(
                [{ "_id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });

        it("should add the added=true property to the configured facebook group", () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "id": 1, "name": "Group" }] };
            expect(facebookSources(state, action).data).to.deep.equal(
                [{ "_id": 1, "added": true, "name": "Group" }, { "id": 2, "name": "Group2" }]);
        });

        it("should add the added=true property to all the sources", () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            let action = {
                "type": FACEBOOK_ADD_GROUP,
                "sources": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }]
            };
            expect(facebookSources(state, action).data).to.deep.equal([
                { "_id": 1, "added": true, "name": "Group" },
                { "_id": 2, "added": true, "name": "Group2" }
            ]);
        });

        it(`should clear the sources and next page when ${CLEAR_SOURCES} is action is performed`, () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": { "offset": 50 } };
            let action = {
                "type": CLEAR_SOURCES
            };
            let sources = facebookSources(state, action);
            expect(sources.data).to.deep.equal([]);
            expect(sources.nextPage).to.deep.equal({});
        });
    });
});
