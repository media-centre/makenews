/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5]*/

"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";
import nock from "nock";

describe("AjaxClient", function() {
    describe("post", () => {
        it("should post and return success promise on success", function(done) {
            let url = "/login";
            let headers = {};
            let data = {"username": "username", "password": "pwd"};
            nock("http://localhost:5000")
                .post(url, JSON.stringify(data))
                .reply(HttpResponseHandler.codes.OK, {"data": "success"}, {});
            let ajax = new AjaxClient(url);
            ajax.post(headers, data)
                .then(succesData => {
                    expect(succesData.data).to.eq("success");
                    done();
                });
        });

        it("should post and return error promise on failure", function (done) {
            let url = "/login";
            let headers = {};
            let data = {"username": "ssds", "password": "sds"};
            nock("http://localhost:5000")
                .post(url, JSON.stringify(data))
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, {"data": "error"}, {});
            let ajax = new AjaxClient(url);
            ajax.post(headers, data)
                .catch(errorData => {
                    expect(errorData.data).to.eq("error");
                    done();
                });
        });
    });

    describe("get", () => {
        it("should do a get request to the url", function(done) {
            nock("http://localhost:5000")
                .get("/home")
                .query({"page": 1})
                .reply(HttpResponseHandler.codes.OK, {"data": "success"});

            let ajax = new AjaxClient("/home?page=1");
            ajax.get().then(succesData => {
                    expect(succesData.data).to.eq("success");
                    done();
                });
        });

        it("should reject on connection refused", function(done) {
            let url = "/home";
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.BAD_GATEWAY);

            let ajax = new AjaxClient(url);
            ajax.get().catch(errorData => {
                    expect(errorData).to.eq("connection refused");
                    done();
                });
        });
    });
});
