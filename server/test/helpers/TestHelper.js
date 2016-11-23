/* eslint no-process-env:0 */

import sinon from "sinon";
import NodeErrorHandler from "../../src/NodeErrorHandler";

process.env.NODE_ENV = "unit_testing";

sinon.stub(NodeErrorHandler, "log");
