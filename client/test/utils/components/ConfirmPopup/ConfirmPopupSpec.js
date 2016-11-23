/* eslint max-nested-callbacks: [2, 5] */
import ConfirmPopup from "../../../../src/js/utils/components/ConfirmPopup/ConfirmPopup";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../../helper/TestHelper";

let confirmPop = null, cancelCalled = null;
describe("ConfirmPopup", ()=> {

    function confirmCallback(event) {
        cancelCalled = event ? event.OK : null;
        return "Test Result";
    }

    before(()=> {
        confirmPop = TestUtils.renderIntoDocument(
        <ConfirmPopup description={"Test description"} callback={confirmCallback}/>
        );
    });
    afterEach(() => {
        cancelCalled = null;
    });

    it("should have descripion and callback as properties", ()=> {
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
        let confirmPopTest = TestUtils.renderIntoDocument(
            <ConfirmPopup description={"Test description"} callback={confirmCallback}/>
        );
        TestUtils.Simulate.click(confirmPopTest.refs.cancelButton);
        assert.isTrue(confirmPopTest.refs.cancelButton.disabled);
        assert.isTrue(confirmPopTest.refs.confirmButton.disabled);
        assert.isFalse(cancelCalled);
    });

    it("should trigger the callback on clicking confirm button", ()=> {
        let confirmPopTest = TestUtils.renderIntoDocument(
            <ConfirmPopup description={"Test description"} callback={confirmCallback}/>
        );
        TestUtils.Simulate.click(confirmPopTest.refs.confirmButton);
        assert.isTrue(confirmPopTest.refs.cancelButton.disabled);
        assert.isTrue(confirmPopTest.refs.confirmButton.disabled);
        assert.isTrue(cancelCalled);
    });

});
