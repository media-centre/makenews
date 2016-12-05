import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP
} from "../../../src/js/config/actions/FacebookConfigureActions";
import { configuredSources } from "../../../src/js/sourceConfig/reducers/SourceConfigurationReducers";
import { GOT_CONFIGURED_SOURCES } from "../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { expect } from "chai";

describe("SourceConfigurationReducers", () => {

    describe("configuredSourcesReceived", () => {
        it("should return an empty list by default when there are no configured sources", () => {
            expect(configuredSources().profiles).to.deep.equal([]);
            expect(configuredSources().groups).to.deep.equal([]);
            expect(configuredSources().pages).to.deep.equal([]);
            expect(configuredSources().web).to.deep.equal([]);
            expect(configuredSources().twitter).to.deep.equal([]);
        });
    });

    describe("getConfiguredSources", () => {
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
});
