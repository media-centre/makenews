import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_GOT_SOURCES,
    PAGES
} from "../../../src/js/config/actions/FacebookConfigureActions";
import {
    sourceResults,
    configuredSources,
    hasMoreSourceResults,
    currentSourceTab
} from "../../../src/js/sourceConfig/reducers/SourceConfigurationReducers";
import {
    GOT_CONFIGURED_SOURCES,
    HAS_MORE_SOURCE_RESULTS,
    NO_MORE_SOURCE_RESULTS,
    CHANGE_CURRENT_SOURCE_TAB,
    WEB,
    CLEAR_SOURCES
} from "../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { WEB_GOT_SOURCE_RESULTS, WEB_ADD_SOURCE } from "./../../../src/js/config/actions/WebConfigureActions";
import { TWITTER_GOT_SOURCE_RESULTS, TWITTER_ADD_SOURCE } from "./../../../src/js/config/actions/TwitterConfigureActions";
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

    describe("configuredSources", () => {
        let state = null;
        beforeEach("configuredSources", () => {
            state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
        });
        it("should add a profile to the state when asked for adding a profile", () => {
            let action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "name": "Profile1", "id": "12345" }] };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a page to the state when asked for adding a page", () => {
            let action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "name": "Page1", "id": "12345" }] };
            expect(configuredSources(state, action).pages).to.deep.equal([{ "name": "Page1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a group to the state when asked for adding a group", () => {
            let action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "name": "Group1", "id": "12345" }] };
            expect(configuredSources(state, action).groups).to.deep.equal([{ "name": "Group1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a web url to the state when asked for adding a web source", () => {
            let action = { "type": WEB_ADD_SOURCE, "sources": [{ "name": "website", "url": "http://website.url" }] };
            expect(configuredSources(state, action).web).to.deep.equal([{ "name": "website", "url": "http://website.url", "_id": "http://website.url" }]);
        });

        it("should add a twitter handle to the state when asked for adding a twitter source", () => {
            let action = { "type": TWITTER_ADD_SOURCE, "sources": [{ "name": "twitter handle", "id": 123 }] };
            expect(configuredSources(state, action).twitter).to.deep.equal([{ "name": "twitter handle", "id": 123, "_id": 123 }]);
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

    describe("Sources Results", () => {
        it("should return an empty list by default when asked sources", () => {
            expect({ "data": [], "nextPage": {} }).to.deep.equal(sourceResults());
        });

        it("should return the list of sources when it got the FACEBOOK sources", () => {
            let sources = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            let action = { "type": FACEBOOK_GOT_SOURCES, "sources": sources };
            let state = sourceResults([], action);
            expect(state.data).to.deep.equal(sources.data);
            expect(state.nextPage).to.deep.equal(sources.paging);
        });

        it("should return the list of sources when it got the WEB sources", () => {
            let sources = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            let action = { "type": WEB_GOT_SOURCE_RESULTS, "sources": sources };
            let state = sourceResults([], action);
            expect(state.data).to.deep.equal(sources.data);
            expect(state.nextPage).to.deep.equal(sources.paging);
        });

        it("should return the list of sources when it got the TWITTER sources", () => {
            let twitterPreFirstId = 12345;
            let sources = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }],
                "paging": {},
                "twitterPreFirstId": twitterPreFirstId
            };
            let action = { "type": TWITTER_GOT_SOURCE_RESULTS, "sources": sources };
            let state = sourceResults([], action);
            expect(state.data).to.deep.equal(sources.data);
            expect(state.nextPage).to.deep.equal(sources.paging);
            expect(state.twitterPreFirstId).to.equal(twitterPreFirstId);
        });

        it("should add the added=true property to the configured facebook profile", () => {
            let state = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "id": 1, "name": "Profile" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });

        it("should add the added=true property to the configured facebook page", () => {
            let state = { "data": [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "id": 1, "name": "Page" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });

        it("should add the added=true property to the configured facebook group", () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            let action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "id": 1, "name": "Group" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Group" }, { "id": 2, "name": "Group2" }]);
        });

        it("should add the added=true property to multiple FACEBOOK_GROUPS when requested with multiple sources", () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            let action = {
                "type": FACEBOOK_ADD_GROUP,
                "sources": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }]
            };
            expect(sourceResults(state, action).data).to.deep.equal([
                { "_id": 1, "id": 1, "added": true, "name": "Group" },
                { "_id": 2, "id": 2, "added": true, "name": "Group2" }
            ]);
        });

        it("should add the added=true property to the configured web url", () => {
            let state = { "data": [{ "url": "http://web.url", "name": "Group" }, { "url": "http://web2.url", "name": "Group2" }], "paging": {} };
            let action = { "type": WEB_ADD_SOURCE, "sources": [{ "url": "http://web.url", "name": "Group" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": "http://web.url", "added": true, "url": "http://web.url", "name": "Group" },
                    { "url": "http://web2.url", "name": "Group2" }]);
        });

        it("should add the added=true property to the configured twitter handle", () => {
            let state = { "data": [{ "id": 123, "name": "india" }, { "id": 456, "name": "mera bharath" }],
                "paging": {},
                "twitterPreFirstId": 123
            };
            let action = { "type": TWITTER_ADD_SOURCE, "sources": [{ "id": 123, "name": "india" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 123, "added": true, "id": 123, "name": "india" },
                    { "id": 456, "name": "mera bharath" }]);
        });

        it(`should clear the sources and next page when ${CLEAR_SOURCES} is action is performed`, () => {
            let state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": { "offset": 50 } };
            let action = {
                "type": CLEAR_SOURCES
            };
            let sources = sourceResults(state, action);
            expect(sources.data).to.deep.equal([]);
            expect(sources.nextPage).to.deep.equal({});
        });
    });
});
