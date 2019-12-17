import { intersectionWith } from "../../src/js/utils/SearchResultsSetOperations";
import { assert } from "chai";
import sinon from "sinon";

describe("SearcResultsSetOperation", () => {
    describe("intersectionWith", () => {
        const pred = (first, second) => first._id === second.id;
        it("should add property for intersected values", () => {
            const sources = [{ "id": 1 }, { "id": 2 }];
            const configuration = [{ "_id": 1 }, { "_id": 3 }];
            intersectionWith(pred, sources, configuration);
            const [first, second] = sources;
            assert.isTrue(first.added);
            assert.isUndefined(second.added);
        });
    
        it("with configuration empty", () => {
            const sources = [{ "id": 1 }, { "id": 2 }];
            const configuration = [];
            const predSpy = sinon.spy();
            intersectionWith(predSpy, sources, configuration);
            assert.isFalse(predSpy.called);
        });
    
        it("with sources empty", () => {
            const sources = [];
            const configuration = [{ "_id": 1 }, { "_id": 3 }];
            const predSpy = sinon.spy();
            intersectionWith(predSpy, sources, configuration);
            assert.isFalse(predSpy.called);
        });
    });
});

