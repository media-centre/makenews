/* eslint no-process-env:0 */

import sinon from "sinon";
import NodeErrorHandler from "../../src/NodeErrorHandler";
import Logger from "../../src/logging/Logger";
import LogTestHelper from "./LogTestHelper";

process.env.NODE_ENV = "unit_testing";

sinon.stub(NodeErrorHandler, "log");
sinon.stub(Logger, "instance").returns(new LogTestHelper());
