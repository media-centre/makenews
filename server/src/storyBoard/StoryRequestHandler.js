import CouchClient from "../CouchClient";


export async function addStory(story, authSession) {
    let document = {
        "docType": "story",
        "title": story
    };
    let couchClient = CouchClient.instance(authSession);
    let stories = await getStoryWithTitle(story.title, authSession);
    if (stories.docs.length) {
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
    try {
        return await couchClient.getDocument(id);
    } catch (error) {
        let notFoundMsg = "No document found";
        throw notFoundMsg;
    }
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

export async function saveStory(story, authSession) {
    let sameTitledStory = await getStoryWithTitle(story.title, authSession);
    if(sameTitledStory.docs.length && story._id !== sameTitledStory.docs[0]._id) { //eslint-disable-line no-magic-numbers
        let message = "Title Already exists";
        throw message;
    }
    story.docType = "story";
    let couchInstance = CouchClient.instance(authSession);
    return await couchInstance.updateDocument(story);
}
