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
            const clock = sandbox.useFakeTimers();
            Toast.show("Category created!!");
            const time = 5000;
            clock.tick(time);
            assert.isTrue(document.getElementById("custom-toast").classList.contains("hide"));
        });

        it("should reuse the toast when it is called multiple times", ()=> {
            const clock = sandbox.useFakeTimers();
            Toast.show("Category created!!");
            const time = 2000;
            clock.tick(time);
            Toast.show("Category re-created!!");
            assert.isFalse(document.getElementById("custom-toast").classList.contains("hide"));
            assert.strictEqual("Category re-created!!", document.querySelector("#custom-toast .message").textContent);
        });

        it("should close the toast by clicking close button", () => {
            Toast.show("Category created!!");
            Toast.close();
            assert.isTrue(document.getElementById("custom-toast").classList.contains("hide"));
        });

        it("should have fa-exclamation when the type is not given", () => {
            Toast.show("Successfully added the url");
            const toastIcon = document.querySelector("#custom-toast i");
            assert.isTrue(toastIcon.classList.contains("fa-exclamation"));
        });

        it("should have fa-check icon when the type is success", () => {
            Toast.show("Successfully added the url", "success");
            const toastIcon = document.querySelector("#custom-toast i");
            assert.isTrue(toastIcon.classList.contains("fa-check"));
        });

        it("should have collection class when the type is collection", () => {
            Toast.show("Successfully added to the collection", "collection");
            const toast = document.getElementById("custom-toast");
            assert.isTrue(toast.classList.contains("collection"));
        });

        it("should have fa-folder icon when the type is collection", () => {
            Toast.show("Successfully added to the collection", "collection");
            const toastIcon = document.querySelector("#custom-toast i");
            assert.isTrue(toastIcon.classList.contains("fa-folder"));
        });

        it("should have bookmark class when the type is bookmark", () => {
            Toast.show("Successfully bookmarked", "bookmark");
            const toast = document.getElementById("custom-toast");
            assert.isTrue(toast.classList.contains("bookmark"));
        });

        it("should have fa-bookmark icon when the type is bookmark", () => {
            Toast.show("Successfully bookmarked", "bookmark");
            const toastIcon = document.querySelector("#custom-toast i");
            assert.isTrue(toastIcon.classList.contains("fa-bookmark"));
        });
    });
});
