/* eslint max-nested-callbacks: [2, 7], radix:0 */
"use strict";

import TakeTour from "../../../src/js/utils/custom_templates/TakeTour";
import sinon from "sinon";
import { assert } from "chai";

let json = null, configureElement = null, addUrlElement = null, getJsonMock = null;
describe("TakeTour", () => {
    beforeEach("before", ()=> {
        json = {
            "navigation": [
                {
                    "selector": "#configure-element",
                    "content": "Click here to configure"
                },
                {
                    "selector": "#addURl-element",
                    "content": "Click here to add url"
                }

            ]
        };
        TakeTour.currentIndex = -1;
        TakeTour.total = 2;

        configureElement = document.createElement("div");
        configureElement.id = "configure-element";
        configureElement.style.position = "absolute";
        configureElement.offsetTop = 100;
        configureElement.offsetLeft = 100;
        configureElement.offsetWidth = 100;
        configureElement.offsetHeight = 100;
        document.body.appendChild(configureElement);

        addUrlElement = document.createElement("div");
        addUrlElement.id = "addURl-element";
        addUrlElement.style.position = "absolute";
        addUrlElement.offsetTop = 200;
        addUrlElement.offsetLeft = 200;
        addUrlElement.offsetWidth = 200;
        addUrlElement.offsetHeight = 200;
        document.body.appendChild(addUrlElement);

        getJsonMock = sinon.mock(TakeTour).expects("getJson");
        getJsonMock.returns(json);

    });
    afterEach("after", ()=> {
        json = null;
        document.body.removeChild(configureElement);
        document.body.removeChild(addUrlElement);
        TakeTour.currentIndex = -1;
        getJsonMock.verify();
        TakeTour.getJson.restore();
    });

    describe("TakeTour", () => {
        it("should have TakeTour template in the document", () => {
            TakeTour.show();
            assert.isNotNull(document.getElementById("take-tour"), "Take Tour template is available");
        });

        it("should get the json element with given index", ()=> {
            TakeTour.currentIndex = 0;
            let jsonElement = TakeTour.getCurrentJsonElement();
            assert.deepEqual({
                "selector": "#configure-element",
                "content": "Click here to configure"
            }, jsonElement);
        });

        it("should update the description on clicking continue button", ()=> {
            TakeTour.show();
            getJsonMock.verify();
            TakeTour.getJson.restore();

            getJsonMock = sinon.mock(TakeTour).expects("getJson");
            getJsonMock.returns(json);
            TakeTour.next();

            assert.strictEqual("Click here to add url", document.querySelector("#take-tour .description").textContent);
        });

        it("should navigate to the dom with next method", ()=> {
            TakeTour.show();
            getJsonMock.verify();
            TakeTour.getJson.restore();

            getJsonMock = sinon.mock(TakeTour).expects("getJson");
            getJsonMock.returns(json);
            TakeTour.next();

            let top = 400;
            assert.strictEqual(top, parseInt(document.querySelector("#take-tour").style.top));
        });

        it("should point configure element", () => {
            TakeTour.show();
            let top = 200;
            assert.strictEqual(top, parseInt(document.querySelector("#take-tour").style.top));
        });

        it("should move to next hint on clicking continue button", () => {
            TakeTour.show();
            document.querySelector("#tour-continue").click();
            let top = 200;
            assert.strictEqual(top, parseInt(document.querySelector("#take-tour").style.top));
        });
    });
});
