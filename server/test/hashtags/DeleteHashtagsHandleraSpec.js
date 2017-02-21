import DeleteHashtagsHandler from "../../src/hashtags/DeleteHashtagsHandler";
import sinon from "sinon";
import { assert } from "chai";
import CouchClient from "../../src/CouchClient";

describe("DeleteHashtagsHandler", () => {
    let deleteHashtagsHandler = null, sandbox = null, couchClient = null, accessToken = null;

    beforeEach("DeleteHashtagsHandler", () => {
        deleteHashtagsHandler = DeleteHashtagsHandler.instance();
        sandbox = sinon.sandbox.create();
        accessToken = "accessToken";
        couchClient = CouchClient.instance(accessToken);
    });

    afterEach("DeleteHashtagsHandler", () => {
        sandbox.restore();
    });

    it("should return success on save", async () => {
        let firstResponse = { "docs": [{ "_id": "id1" }, { "_id": "id2" }, { "_id": "id3" }, { "_id": "id4" },
            { "_id": "id5" }, { "_id": "id6" }, { "_id": "id7" }, { "_id": "id8" }, { "_id": "id9" }, { "_id": "id10" },
            { "_id": "id11" }, { "_id": "id12" }, { "_id": "id13" }, { "_id": "id14" }, { "_id": "id15" }, { "_id": "id16" },
            { "_id": "id17" }, { "_id": "id18" }, { "_id": "id19" }, { "_id": "id20" }, { "_id": "id21" }, { "_id": "id22" },
            { "_id": "id23" }, { "_id": "id24" }, { "_id": "id25" }] };
        let secondResponse = { "docs": [{ "_id": "id27" }, { "_id": "id28" }, { "_id": "id29" }, { "_id": "id30" }] };

        sandbox.mock(CouchClient).expects("instance").withExactArgs(accessToken).returns(couchClient);
        let findDocs = sandbox.mock(couchClient).expects("findDocuments").twice();
        findDocs.onFirstCall().returns(Promise.resolve(firstResponse));
        findDocs.onSecondCall().returns(Promise.resolve(secondResponse));
        let saveDocs = sandbox.mock(couchClient).expects("saveBulkDocuments");

        try {
            await deleteHashtagsHandler.deleteHashtags(accessToken);
            findDocs.verify();
            saveDocs.verify();
        } catch(error) {
            assert.fail(error);
        }
    });
});
