/* eslint max-nested-callbacks: [2, 5] */
import ConfirmPopup from "../../../../src/js/utils/components/ConfirmPopup/ConfirmPopup";
import Locale from "../../../../src/js/utils/Locale";
import * as HeaderActions from "./../../../../src/js/header/HeaderActions";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../../helper/TestHelper";
import sinon from "sinon";

let confirmPop = null, cancelCalled = null;
describe("ConfirmPopup", ()=> {

    function confirmCallback(event) {
        cancelCalled = event;
        return "Test Result";
    }

    before(()=> {
        sinon.stub(Locale, "applicationStrings").returns({ "messages": { "confirmPopup": {
            "ok": "OK",
            "confirm": "CONFIRM",
            "cancel": "CANCEL"
        } } });
        confirmPop = TestUtils.renderIntoDocument(
        <ConfirmPopup description={"Test description"} callback={confirmCallback}/>
        );
    });
    afterEach(() => {
        cancelCalled = null;
    });

    it("should have description and callback as properties", ()=> {
        assert.strictEqual(confirmPop.props.description, "Test description");
        assert.strictEqual(confirmPop.props.callback(), "Test Result");
    });

    it("should have description along with OK and Cancel button", ()=> {
        assert.isDefined(confirmPop.refs.description, "Description is not available");
        assert.isDefined(confirmPop.refs.confirmButton, "confirmButton is not available");
        assert.isDefined(confirmPop.refs.cancelButton, "cancelButton is not available");
    });

    it("should display the description in the popup", ()=> {
        assert.strictEqual(confirmPop.refs.description.textContent, "Test description");
    });

    it("should trigger the callback on clicking cancel button", ()=> {
        const anonymousFun = () => {};
        const sandbox = sinon.sandbox.create();
        const popUpMock = sandbox.mock(HeaderActions).expects("popUp").returns({ "type": "", "message": "", "callback": () => {} });

        let confirmPopTest = TestUtils.renderIntoDocument(
            <ConfirmPopup description={"Test description"} callback={confirmCallback} dispatch={anonymousFun}/>
        );
        TestUtils.Simulate.click(confirmPopTest.refs.cancelButton);
        assert.isTrue(confirmPopTest.refs.cancelButton.disabled);
        assert.isTrue(confirmPopTest.refs.confirmButton.disabled);
        assert.isFalse(cancelCalled);

        popUpMock.verify();
        sandbox.restore();
    });

    it("should trigger the callback on clicking confirm button", ()=> {
        const anonymousFun = () => {};
        const sandbox = sinon.sandbox.create();
        const popUpMock = sandbox.mock(HeaderActions).expects("popUp").returns({ "type": "", "message": "", "callback": () => {} });

        let confirmPopTest = TestUtils.renderIntoDocument(
            <ConfirmPopup description={"Test description"} callback={confirmCallback} dispatch={anonymousFun}/>
        );
        TestUtils.Simulate.click(confirmPopTest.refs.confirmButton);
        assert.isTrue(confirmPopTest.refs.cancelButton.disabled);
        assert.isTrue(confirmPopTest.refs.confirmButton.disabled);
        assert.isTrue(cancelCalled);

        popUpMock.verify();
        sandbox.restore();
    });

});
