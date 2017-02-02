import CouchClient from "../CouchClient";


export async function addStory(story, authSession) {
    let document = _getDocument(story);
    let couchClient = CouchClient.instance(authSession);
    let docs = await getStoryWithTitle(story.title, authSession);
    if (docs.docs.length) {
        let conflictMsg = "Story title already exist";
        throw conflictMsg;
    }
    try {
        return await couchClient.updateDocument(document);
    } catch (error) {
        let errorMsg = "Unable to add the story";
        throw errorMsg;
    }
}

function _getDocument(story) {
    if (story._id) {
        story.docType = "story";
        return story;
    }
    return { "title": story.title, "docType": "story" };

}

export async function getStoryWithTitle(title, authSession) {
    let couchClient = CouchClient.instance(authSession);
    let query = {
        "selector": {
            "docType": {
                "$eq": "story"
            },
            "title": {
                "$eq": title
            }
        }
    };
    return await couchClient.findDocuments(query);
}

export async function getStory(id, authSession) {
    let couchClient = CouchClient.instance(authSession);
    let query = {
        "selector": {
            "docType": {
                "$eq": "story"
            },
            "_id": {
                "$eq": id
            }
        },
        "fields": ["title", "_id", "_rev"]
    };

    let response = await couchClient.findDocuments(query);
    let [document] = response.docs;
    if (document) {
        return document;
    }
    let notFoundMsg = "No document found";
    throw notFoundMsg;
}

export async function getStories(authSession) {
    let couchClient = CouchClient.instance(authSession);
    let query = {
        "selector": {
            "docType": {
                "$eq": "story"
            }
        },
        "fields": ["title", "_id"]
    };
    return await couchClient.findDocuments(query);
}
