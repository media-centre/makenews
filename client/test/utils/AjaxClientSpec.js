"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import { assert } from "chai";
import nock from "nock";

describe("AjaxClient", function() {
    it("should post and return success promise on success", function(done) {
      let url = "/login";
      let headers = {};
      let data = { "username": "username", "password": "pwd" };
      nock("http://localhost:5000")
      .post(url, JSON.stringify(data))
      .reply(HttpResponseHandler.codes.OK, { data: "success" }, {});
      let ajax = new AjaxClient(url);
      ajax.post(headers, data)
      .then(succesData => {
          assert.strictEqual("success", succesData["data"]);
          done();
      });
  });

    it("should post and return error promise on failure", function(done) {
      let url = "/login";
      let headers = {};
      let data = { "username": "ssds", "password": "sds" };
      nock("http://localhost:5000")
      .post(url, JSON.stringify(data))
      .reply(HttpResponseHandler.codes.UNAUTHORIZED, { data: "error" }, {});
      let ajax = new AjaxClient(url);
      ajax.post(headers, data)
      .catch(errorData => {
          assert.strictEqual("error", errorData["data"]);
          done();
      });
  });
});
