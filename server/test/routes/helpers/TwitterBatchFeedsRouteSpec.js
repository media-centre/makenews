
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterBatchFeedsRoute from "../../../src/routes/helpers/TwitterBatchFeedsRoute";
import TwitterRequestHandler from "../../../src/twitter/TwitterRequestHandler";
import RouteLogger from "../../../src/routes/RouteLogger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";

describe("TwitterBatchFeedsRoute", () => {

    let sandbox = null;
    before("TwitterBatchFeedsRoute", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
    });

    after("TwitterBatchFeedsRoute", () => {
        sandbox.restore();
    });

    it("should return all feeds from all the tweet hashtags", (done)=> {
        let Jan18Timestamp = "2016-01-18T06:12:19+00:00";
        let Jan17Timestamp = "2016-01-17T06:12:19+00:00";


        let hinduResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp },
            { "id": 2, "id_str": "124", "text": "Tweet 2", "created_at": Jan17Timestamp }] };

        let toiResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp }] };

        let response = {
            "status": (actualStatus) => {
                assert.strictEqual(actualStatus, HttpResponseHandler.codes.OK);
            },
            "json": (actualJson) => {
                assert.deepEqual(actualJson, { "tweet1_id": hinduResponseWithTimestamp, "tweet2_id": toiResponseWithTimestamp });
                done();
                sandbox.restore();
            }
        };

        let request = {
            "body": {
                "data": [
                    { "url": "@the_hindu", "timestamp": Jan17Timestamp, "id": "tweet1_id" },
                    { "url": "@toi", "timestamp": Jan18Timestamp, "id": "tweet2_id" }
                ],
                "userName": "testUser"
            }
        };

        let urlResponse = { "@the_hindu": Promise.resolve(hinduResponseWithTimestamp), "@toi": Promise.resolve(toiResponseWithTimestamp) };
        let twitterRequestHandler = {
            "fetchTweetsRequest": (url) => {
                return urlResponse[url];
            }
        };
        sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);

        let twitterBatchFeedsRoute = new TwitterBatchFeedsRoute(request, response, {});
        twitterBatchFeedsRoute.handle();
    });
});
