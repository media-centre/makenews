import { intersectionWith } from "../../src/js/utils/SearchResultsSetOperations";
import { assert } from "chai";
import sinon from "sinon";

describe("SearcResultsSetOperation", () => {
    describe("intersectionWith", () => {
        let pred = (first, second) => first._id === second.id;
        it("should add property for intersected values", () => {
            let sources = [{ "id": 1 }, { "id": 2 }];
            let configuration = [{ "_id": 1 }, { "_id": 3 }];
            intersectionWith(pred, sources, configuration);
            let [first, second] = sources;
            assert.isTrue(first.added);
            assert.isUndefined(second.added);
        });
    
        it("with configuration empty", () => {
            let sources = [{ "id": 1 }, { "id": 2 }];
            let configuration = [];
            let predSpy = sinon.spy();
            intersectionWith(predSpy, sources, configuration);
            assert.isFalse(predSpy.called);
        });
    
        it("with sources empty", () => {
            let sources = [];
            let configuration = [{ "_id": 1 }, { "_id": 3 }];
            let predSpy = sinon.spy();
            intersectionWith(predSpy, sources, configuration);
            assert.isFalse(predSpy.called);
        });
    });
});

