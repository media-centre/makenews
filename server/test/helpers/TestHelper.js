/* eslint no-process-env:0 */
"use strict";
import sinon from "sinon";
import NodeErrorHandler from "../../src/NodeErrorHandler.js";

process.env.NODE_ENV = "unit_testing";

sinon.stub(NodeErrorHandler, "log");
