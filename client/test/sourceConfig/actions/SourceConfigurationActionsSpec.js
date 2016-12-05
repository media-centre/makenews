import { expect } from "chai";
import UserSession from "../../../src/js/user/UserSession";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import {
    GOT_CONFIGURED_SOURCES,
    configuredSourcesReceived,
    getConfiguredSources
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

        it(`should dispatch ${GOT_CONFIGURED_SOURCES} with empty array if there is an error from server`, (done) => {
            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            let ajaxClient = AjaxClient.instance("/configuredSources", false);
            sandbox.mock(AjaxClient).expects("instance").withArgs("/configuredSources", false).returns(ajaxClient);
            sandbox.stub(ajaxClient, "get").withArgs().returns(Promise.reject("error"));

            let store = mockStore({}, [{ "type": GOT_CONFIGURED_SOURCES, "sources": [] }], done);
            store.dispatch(getConfiguredSources());
        });
    });
});
