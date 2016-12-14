import { expect } from "chai";
import UserSession from "../../../src/js/user/UserSession";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import {
    GOT_CONFIGURED_SOURCES,
    NO_MORE_SOURCE_RESULTS,
    HAS_MORE_SOURCE_RESULTS,
    CLEAR_SOURCES,
    configuredSourcesReceived,
    getConfiguredSources,
    noMoreSourceResults,
    hasMoreSourceResults,
    clearSources
} from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import sinon from "sinon";

describe("SourceConfigurationActions", () => {
    describe("configured sources", () => {
        let sandbox = null;

        beforeEach("configured sources", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("configured sources", () => {
            sandbox.restore();
        });

        it(`should return ${GOT_CONFIGURED_SOURCES} action when it receives configured sources`, () => {
            let sources = [{ "name": "Profile1" }, { "name": "Profile2" }];
            let action = configuredSourcesReceived(sources);
            expect(action.type).to.equal(GOT_CONFIGURED_SOURCES);
            expect(action.sources).to.deep.equal(sources);
        });

        it(`should dispatch ${GOT_CONFIGURED_SOURCES} once it gets the configured sources from server`, (done) => {
            let sources = { "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            let ajaxClient = AjaxClient.instance("/configuredSources", false);
            sandbox.mock(AjaxClient).expects("instance").withArgs("/configuredSources", false).returns(ajaxClient);
            sandbox.stub(ajaxClient, "get").withArgs().returns(Promise.resolve(sources));

            let store = mockStore({}, [{ "type": GOT_CONFIGURED_SOURCES, "sources": sources }], done);
            store.dispatch(getConfiguredSources());
        });
    });

    describe("source results", () => {
        it(`should return ${NO_MORE_SOURCE_RESULTS} when request for noMoreSourceResults action`, () => {
            expect(noMoreSourceResults()).to.deep.equal({ "type": NO_MORE_SOURCE_RESULTS });
        });

        it(`should return ${HAS_MORE_SOURCE_RESULTS} when request for hasMoreSourceResults action`, () => {
            expect(hasMoreSourceResults()).to.deep.equal({ "type": HAS_MORE_SOURCE_RESULTS });
        });

        it(`should return ${CLEAR_SOURCES} when request for clearSources action`, () => {
            expect(clearSources()).to.deep.equal({ "type": CLEAR_SOURCES });
        });
    });
});
