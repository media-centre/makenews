import { assert } from "chai";

export async function isRejected(asyncFn, rejection) {
    try {
        await asyncFn;
        assert.fail("Resolved:: IT SHOULD BE REJECTED");
    } catch (err) {
        assert.deepEqual(err, rejection);
    }
}
