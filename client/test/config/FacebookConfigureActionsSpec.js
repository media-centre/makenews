import { facebookGetProfiles, facebookProfilesReceived, FACEBOOK_GOT_PROFILES } from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import LoginPage from "../../src/js/login/pages/LoginPage";
import "../helper/TestHelper";
import UserSession from "../../src/js/user/UserSession";
import mockStore from "../helper/ActionHelper";

describe("Facebook Configure Actions", () => {
    describe("facebook profiles", () => {
        let profiles = null, sandbox = null;

        beforeEach("facebook Profile", () => {
            profiles = [{ "name": "testProfile" }];
            sandbox = sinon.sandbox.create();
        });

        afterEach("facebook Profile", () => {
            sandbox.restore();
        });

        it("should return type FACEBOOK_GOT_PROFILES action", () => {
            let facebookConfigureAction = { "type": FACEBOOK_GOT_PROFILES, "profiles": profiles };
            expect(facebookConfigureAction).to.deep.equal(facebookProfilesReceived(profiles));
        });

        it("should dispatch FACEBOOK_GOT_PROFILES action", (done) => {
            let userName = "user";
            let serverUrl = "/facebook-profiles";

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            sandbox.mock(LoginPage).expects("getUserName").returns(userName);

            let ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            let ajaxClientGetMock = sandbox.mock(ajaxClient).expects("get").withArgs({ "userName": userName });
            ajaxClientGetMock.returns(Promise.resolve({ "profiles": profiles }));

            let store = mockStore({}, [{ "type": "FACEBOOK_GOT_PROFILES", "profiles": profiles }], done);
            store.dispatch(facebookGetProfiles());
        });
    });
});
