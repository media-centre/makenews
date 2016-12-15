import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    PAGES
} from "../../../src/js/config/actions/FacebookConfigureActions";
import {
    configuredSources,
    hasMoreSourceResults,
    currentSourceTab
} from "../../../src/js/sourceConfig/reducers/SourceConfigurationReducers";
import {
    GOT_CONFIGURED_SOURCES,
    HAS_MORE_SOURCE_RESULTS,
    NO_MORE_SOURCE_RESULTS,
    CHANGE_CURRENT_SOURCE_TAB,
    WEB
} from "../../../src/js/sourceConfig/actions/SourceConfigurationActions";
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
        let state = null;
        beforeEach("getConfiguredSources", () => {
            state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
        });
        it("should add a profile to the state when asked for adding a profile", () => {
            let action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "name": "Profile1" }] };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1" }]);
        });

        it("should add a page to the state when asked for adding a page", () => {
            let action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "name": "Page1" }] };
            expect(configuredSources(state, action).pages).to.deep.equal([{ "name": "Page1" }]);
        });

        it("should add a group to the state when asked for adding a group", () => {
            let action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "name": "Group1" }] };
            expect(configuredSources(state, action).groups).to.deep.equal([{ "name": "Group1" }]);
        });

        it("should return updated state with configured profiles", () => {
            let sources = { "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };
            let action = { "type": GOT_CONFIGURED_SOURCES, "sources": sources };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1" }, { "name": "Profile2" }]);
        });
    });

    describe("hasMoreSourceResults", () => {
        it("should give true if no action type is given", () => {
            expect(hasMoreSourceResults()).to.be.true; //eslint-disable-line no-unused-expressions
        });

        it(`should give true if action type is ${HAS_MORE_SOURCE_RESULTS}`, () => {
            expect(hasMoreSourceResults(null, { "type": HAS_MORE_SOURCE_RESULTS })).to.be.true; //eslint-disable-line no-unused-expressions
        });

        it(`should give false if action type is ${NO_MORE_SOURCE_RESULTS}`, () => {
            expect(hasMoreSourceResults(null, { "type": NO_MORE_SOURCE_RESULTS })).to.be.false; //eslint-disable-line no-unused-expressions
        });
    });
    describe("current source Tab", () => {
        it("should return Web as current tab by default", () => {
            expect(currentSourceTab()).to.equal(WEB);
        });

        it(`should return given currentTab when ${CHANGE_CURRENT_SOURCE_TAB} is dispatched`, () => {
            let action = { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": PAGES };
            expect(currentSourceTab("", action)).to.equal(PAGES);
        });
    });

});
