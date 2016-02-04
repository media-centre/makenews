"use strict";

import Toast from "../../../src/js/utils/custom_templates/Toast";
import sinon from "sinon";
import { assert } from "chai";

describe("Toast", () => {
    describe("show", () => {
        let sandbox = null;
        beforeEach("show", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("show", () => {
            sandbox.restore();
        });

        it("should have Toast template in the document", () => {
            Toast.show("Category created!!");
            assert.isNotNull(document.getElementById("custom-toast"), "Toast template is available");
        });

        it("should be hidden in 5 seconds", () => {
            let clock = sandbox.useFakeTimers();
            Toast.show("Category created!!");
            let time = 5000;
            clock.tick(time);
            assert.isTrue(document.getElementById("custom-toast").classList.contains("hide"));
        });

        it("should reuse the toast when it is called multiple times", ()=> {
            let clock = sandbox.useFakeTimers();
            Toast.show("Category created!!");
            let time = 2000;
            clock.tick(time);
            Toast.show("Category re-created!!");
            assert.isFalse(document.getElementById("custom-toast").classList.contains("hide"));
            assert.strictEqual("Category re-created!!", document.querySelector("#custom-toast .message").textContent);
        });

        it("should close the toast by clicking close button", ()=> {
            Toast.show("Category created!!");
            Toast.close();
            assert.isTrue(document.getElementById("custom-toast").classList.contains("hide"));
        });
    });
});
