/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { allCategories, categoryDetails, DEFAULT_CATEGORY } from "../../src/js/config/reducers/ConfigReducer.js";
import { DISPLAY_ALL_CATEGORIES } from "../../src/js/config/actions/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../../src/js/config/actions/CategoryActions.js";
import { expect } from "chai";
import { List } from "immutable";

describe("Config Reducer", () => {
    describe("allCategories", () => {
        it("default state should return default category", () => {
            expect({ "categories": new List([DEFAULT_CATEGORY]) }).to.deep.equal(allCategories());
        });

        it("should not include the default category twice in the state if it is already exists in parameters", () => {
            let action = { "type": "DISPLAY_ALL_CATEGORIES", "categories": [{"_id": "", "name":DEFAULT_CATEGORY}, {"_id": "id1", "name":"Sports"}] };
            let expectedState = { "categories": [{"_id": "", "name":DEFAULT_CATEGORY}, {"_id": "id1", "name":"Sports"}] };
            let actualState = allCategories(null, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.deep.equal(expectedState.categories[0]);
            expect(actualState.categories.get(1)).to.deep.equal(expectedState.categories[1]);
        });

        it("should include the default category category by default in the state", () => {
            let action = { "type": DISPLAY_ALL_CATEGORIES, "categories": [{"_id": "id1", "name":"Sports"}] };
            let expectedState = { "categories": [{"_id": "id1", "name":"Sports"}, {"_id": "", "name":DEFAULT_CATEGORY}] };
            let actualState = allCategories(undefined, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.deep.equal(expectedState.categories[0]);
            expect(actualState.categories.get(1)).to.deep.equal(expectedState.categories[1]);

        });
    });

    describe("categoryDetails", () => {
        it("return default category config details ", () => {
            let action = { "type": DISPLAY_CATEGORY };
            let expected = {
                "sources": {
                    "rss": { "name": "RSS", "details": [] },
                    "facebook": { "name": "Facebook", "details": [] },
                    "twitter": { "name": "Twitter", "details": [] }
                } };
            expect(expected).to.deep.equal(categoryDetails(undefined, action));
        });

        it("return default categoryConfig if the source Urls configuration object is null", () => {
            let action = { "type": DISPLAY_CATEGORY, "sourceUrlsObj": null };
            let expected = {
                "sources": {
                    "rss": { "name": "RSS", "details": [] },
                    "facebook": { "name": "Facebook", "details": [] },
                    "twitter": { "name": "Twitter", "details": [] }
                } };
            expect(expected).to.deep.equal(categoryDetails(undefined, action));
        });

        it("return categoryConfig from categoryDocument", () => {
            let sourceUrlsObj = {
                "rss": [
                    {
                        "_id": "rss_id1",
                        "url": "rss_url1"
                    },
                    {
                        "_id": "rss_id2",
                        "url": "rss_url2"
                    }
                ],
                "twitter": [
                    {
                        "_id": "twitter_id1",
                        "url": "twitter_url1"
                    }
                ],
                "facebook": [
                    {
                        "_id": "facebook_id1",
                        "url": "facebook_url1"
                    }
                ]
            };
            let action = { "type": DISPLAY_CATEGORY, sourceUrlsObj };

            let expectedState = {
                                  "sources": {
                                      "rss": {
                                          "details": [
                                              {
                                                  "_id": "rss_id1",
                                                  "url": "rss_url1"
                                              },
                                              {
                                                  "_id": "rss_id2",
                                                  "url": "rss_url2"
                                              }
                                          ],
                                          "name": "RSS"
                                      },
                                      "twitter": {
                                          "details": [
                                              {
                                                  "_id": "twitter_id1",
                                                  "url": "twitter_url1"
                                              }
                                          ],
                                          "name": "Twitter"
                                      },
                                      "facebook": {
                                          "details": [
                                              {
                                                  "_id": "facebook_id1",
                                                  "url": "facebook_url1"
                                              }
                                          ],
                                          "name": "Facebook"
                                      }
                                  }
                                };
            expect(expectedState).to.deep.equal(categoryDetails(undefined, action));
        });
    });

});
