import { assert } from "chai";

export async function isRejected(asyncFn, rejection) {
    try {
        await asyncFn;
        assert.fail("rejected but resolved");
    } catch (err) {
        assert.deepEqual(err, rejection);
    }
}
