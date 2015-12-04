"use strict";

import SurfDb from "./SurfDb.js";

export default class SurfApplicationQueries {
    static fetchAllSourcesWithCategoryName() {
        return new Promise((resolve, reject) => {
            SurfDb.fetchAllSourcesWithCategories().then((sourcesCategoriesDocs) => {
                let sourcesDocs = sourcesCategoriesDocs.filter(sourcesCategoriesDoc => { return sourcesCategoriesDoc.docType === "source" });
                sourcesDocs.forEach(sourceDoc => {
                     let categoriesOfSource = sourcesCategoriesDocs.filter(sourcesCategoriesDoc => {
                        return sourceDoc.categoryIds.includes(sourcesCategoriesDoc._id);
                    });
                    sourceDoc.categoryNames = categoriesOfSource.map(category => { return category.name; });
                    return sourceDoc;
                });
                resolve(sourcesDocs);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}