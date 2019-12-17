import {
    loginFailed,
    loginSuccess,
    userLogin,
    LOGIN_SUCCESS,
    LOGIN_FAILED
} from "../../src/js/login/LoginActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import UserSession from "../../src/js/user/UserSession";
import { expect } from "chai";
import sinon from "sinon";
import mockStore from "../helper/ActionHelper";

describe("Loginactions", () => {
    it("return type LOGIN_SUCCESS action", function() {
        const loginSuccessAction = { "type": "LOGIN_SUCCESS" };
        expect(loginSuccessAction).to.deep.equal(loginSuccess());
    });
    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        expect(loginFailedAction).to.deep.equal(loginFailed("invalid login"));
    });

});

describe("LoginActions", () => {
    let headers = null;
    let data = null;
    let userName = null;
    let password = null;
    let ajaxInstanceMock = null;
    let ajaxPostMock = null;
    let history = null;
    let sandbox = null;
    beforeEach("userLogin", () => {
        userName = "test_user";
        password = "test_password";
        history = { "push": () => {} };
        headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        data = { "username": userName, "password": password };
        sandbox = sinon.sandbox.create();
        const ajaxInstance = new AjaxClient("/login", true);
        ajaxInstanceMock = sandbox.mock(AjaxClient);
        ajaxInstanceMock.expects("instance").withArgs("/login").returns(ajaxInstance);
        ajaxPostMock = sandbox.mock(ajaxInstance).expects("post");
    });

    afterEach("userLogin", () => {
        ajaxPostMock.verify();
        sandbox.restore();
    });

    describe("success", () => {
        let historyMock = null;
        let userSessionMock = null;
        const response = { "userName": userName, "dbParameters": { "remoteDbUrl": "http://localhost:5984" } };
        let appSessionStorage = null;
        beforeEach("userLogin", () => {
            appSessionStorage = new AppSessionStorage();
            const userSession = new UserSession();
            sandbox.stub(UserSession, "instance").returns(userSession);
            userSessionMock = sandbox.mock(userSession).expects("init");
            historyMock = sandbox.mock(history).expects("push");
        });

        afterEach("userLogin", () => {
            sandbox.restore();
            userSessionMock.verify();
            historyMock.verify();
        });

        it("should dispatch login successful action if the login is successful", (done) => {
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            sandbox.stub(appSessionStorage, "setValue");

            ajaxPostMock.withArgs(headers, data).returns(Promise.resolve(response));
            historyMock.withArgs("/newsBoard");

            const expectedActions = [
                { "type": LOGIN_SUCCESS }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(userLogin(history, userName, password));
        });

        it("should redirect to onboard page for first time user", (done) => {
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            sandbox.stub(appSessionStorage, "setValue");

            const responseWithFirstTimeUser = Object.assign({}, response, { "firstTimeUser": true });
            ajaxPostMock.withArgs(headers, data)
                .returns(Promise.resolve(responseWithFirstTimeUser));
            historyMock.withArgs("/onboard");
            const expectedActions = [
                { "type": LOGIN_SUCCESS }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(userLogin(history, userName, password));
        });

        it("should store the first time user prop in session storage", async() => {
            const responseWithFirstTimeUser = Object.assign({}, response, { "firstTimeUser": true });
            ajaxPostMock.withArgs(headers, data)
                .returns(Promise.resolve(responseWithFirstTimeUser));
            historyMock.withArgs("/onboard");

            const setValueSpy = sandbox.spy();
            appSessionStorage = { "setValue": setValueSpy };
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);

            setValueSpy.withArgs(AppSessionStorage.KEYS.FIRST_TIME_USER, true);

            await userLogin(history, userName, password)(()=>{});

            //eslint-disable-next-line no-unused-expressions
            expect(setValueSpy.withArgs(AppSessionStorage.KEYS.FIRST_TIME_USER, true).calledOnce).to.be.true;
        });
    });

    describe("failure", () => {
        it("should dispatch login failure action if the login is not successful", (done) => {
            ajaxPostMock.withArgs(headers, data).returns(Promise.reject("error"));
            const expectedActions = [
                { "type": LOGIN_FAILED, "responseMessage": "Invalid user name or password" }
            ];
            const store = mockStore({ "errorMessage": "" }, expectedActions, done);

            store.dispatch(userLogin(history, userName, password));
        });
    });
});
