/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

import { allCategories, categoryDetails, configurePageLocale } from "../../src/js/config/reducers/ConfigReducer";
import Locale from "../../src/js/utils/Locale";
import { DISPLAY_CATEGORY } from "../../src/js/config/actions/CategoryActions";
import { assert, expect } from "chai";
import { List } from "immutable";
import sinon from "sinon";

const DEFAULT_CATEGORY = "Default Category";

describe("Config Reducer", () => {
    describe("allCategories", () => {
        it("default state should return empty list", () => {
            expect({ "categories": new List([]) }).to.deep.equal(allCategories());
        });

        it("should return the action categories as new state", () => {
            let action = { "type": "DISPLAY_ALL_CATEGORIES", "categories": [{ "_id": "", "name": DEFAULT_CATEGORY }, { "_id": "id1", "name": "Sports" }] };
            let expectedState = { "categories": [{ "_id": "", "name": DEFAULT_CATEGORY }, { "_id": "id1", "name": "Sports" }] };
            let actualState = allCategories(null, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.deep.equal(expectedState.categories[0]); //eslint-disable-line no-magic-numbers
            expect(actualState.categories.get(1)).to.deep.equal(expectedState.categories[1]); //eslint-disable-line no-magic-numbers
        });

        it("should return the same state in case of default case", () => {
            let action = { "type": "OTHER_CATEGORY" };
            let state = { "categories": [{ "_id": "", "name": DEFAULT_CATEGORY }, { "_id": "id1", "name": "Sports" }] };
            let actualState = allCategories(state, action);
            expect(state).to.deep.equal(actualState);
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

    describe("configLocale", () => {
        it("should have configure page strings in English by default", () => {
            let applicationStrings = {
                "locales": ["en"],

                "messages": {
                    "configurePage": {
                        "allCategories": {
                            "allCategoriesHeading": "All Categories",
                            "addNewCategoryLabel": "Add new category"
                        },
                        "categoryDetailsPage": {
                            "allCategoriesLinkLabel": "All Categories",
                            "deleteCategoryLinkLabel": "Delete Category",
                            "addUrlLinkLabel": "Add Url"
                        }
                    }
                }
            };
            let applicationStringsMock = sinon.mock(Locale).expects("applicationStrings");
            applicationStringsMock.returns(applicationStrings);
            let configurePageLocales = configurePageLocale();
            assert.strictEqual("All Categories", configurePageLocales.categoryDetailsPage.allCategoriesLinkLabel);
            applicationStringsMock.verify();
            Locale.applicationStrings.restore();
        });
    });
});
