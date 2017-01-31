import FetchArticleFromUrl from "./../../../src/routes/helpers/FetchArticleFromUrl";
import { expect } from "chai";
import * as WebClient from "./../../../src/web/WebClient";
import sinon from "sinon";

describe("FetchArticleFromUrl", () => {
    describe("validate", () => {
        it("should return error message of missing params if url parameter is not passed", () => {
            let fetchArticle = new FetchArticleFromUrl({
                "query": { }
            }, {});

            expect(fetchArticle.validate()).to.equal("missing parameter url");
        });
    });

    describe("handle", () => {

        let sandbox = null;

        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should get the HTML for a valid url", async () => {
            let fetchArticle = new FetchArticleFromUrl({
                "query": { "url": "http://some.url" }
            }, {});

            sandbox.mock(WebClient).expects("fetchArticleData").withArgs("http://some.url")
                .returns(`<div>
                            Cricket
                            <p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p>
                        </div>`);


            let expectedHTML = {
                "markup": `<div>
                            Cricket
                            <p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p>
                        </div>`
            };

            let article = await fetchArticle.handle();
            expect(article).to.deep.equal(expectedHTML);
        });
    });
});
