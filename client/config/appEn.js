/*eslint no-multi-str:0*/
"use strict";
if(!window.mediaCenter) {
    window.mediaCenter = {};
}
window.mediaCenter.appEn = {
    "locales": ["en"],

    "messages": {
        "loginPage": {
            "login": {
                "loginButton": "Login",
                "userNamePlaceHoder": "username",
                "passwordPlaceHoder": "password",
                "loginHelpLabel": "Need help to login"

            },
            "branding": {
                "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, \
                        sed suscipit tellus. Nunc fringilla euismod felis eget lobortis. Duis et maximus turpis, vitae pretium diam. Donec imperdiet fermentum neque sed sollicitudin. In mollis elementum \
                        nisl et faucibus. Proin lectus tortor, facilisis dapibus efficitur eu, vehicula ac orci. Quisque arcu mauris, tempor eu urna nec, interdum venenatis magna. Vestibulum pellentesque \
                        vulputate erat, et sodales sem fringilla nec. Pellentesque sit amet pellentesque elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
                        Sed tincidunt nec nunc a placerat. Suspendisse sodales a sem vitae fermentum. Phasellus elit turpis, bibendum sed suscipit eget, lacinia at justo."
            },
            "featuresHelp": {
                "configureHelp": {
                    "name": "Configure",
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, \
                    sed suscipit tellus. Nunc fringilla euismod felis eget lobortis."
                },
                "surfHelp": {
                    "name": "Surf",
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, \
                    sed suscipit tellus. Nunc fringilla euismod felis eget lobortis."
                },
                "parkHelp": {
                    "name": "Park",
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, \
                    sed suscipit tellus. Nunc fringilla euismod felis eget lobortis."
                }
            }
        },
        "configurePage": {
            "allCategories": {
                "allCategoriesHeading": "All Categories",
                "addNewCategoryLabel": "Add new category"
            },
            "categoryDetailsPage": {
                "allCategoriesLinkLabel": "All Categories",
                "deleteCategoryLinkLabel": "Delete Category",
                "addUrlLinkLabel": "Add URL",
                "categoryDeletionConfirm": "will be deleted and you will no longer receive feeds from its URLs. Parked items will remain unaffected. Are you sure you want to continue?",
                "deleteURLConfirm": "You will no longer receive feeds from this URL. Parked items will remain unaffected. Are you sure you want to continue?",
                "hintMessages": {
                    "RSSExampleURL": "Example: http://www.thehindu.com/opinion/?service=rss",
                    "TwitterExampleURL": "Example: @martinfowler, #savetheinternet",
                    "FacebookExampleURL": "Example: https://www.facebook.com/barackobama",
                    "categoryTitle": "Invalid category name. Use only space or - or _"
                },
                "successMessages": {
                    "categoryDeleteSuccess": "is successfully deleted",
                    "categoryUpdated": "Category name is updated to",
                    "urlDeleteSuccess": "Feed URL successfully deleted",
                    "urlSuccess": "URL is successfully added"
                },
                "errorMessages": {
                    "invalidUrlFormat": "Invalid URL. Please check the URL",
                    "emptyUrl": "URL cannot be empty",
                    "validatingUrl": "Validating the URL...",
                    "alreadyAdded": "URL is already added",
                    "noSuchUrl": "No such link found. Please add a valid URL",
                    "invalidRssUrl": "Invalid URL. Please check the URL",
                    "invalidTwitterUrl": "Invalid twitter handler/hashtag",
                    "invalidFacebookUrl": "Invalid facebook URL. Please check the URL",
                    "noFbAccess": "No such link or no access to the profile",
                    "urlDeleteFailed": "URL deletion failed",
                    "categoryNameExists": "Category name already exists",
                    "categoryNameCantBeEmpty": "Category name can not be empty"
                }
            },
            "configureTabName": "Configure"
        },
        "surfPage": {
            "noFeeds": "You don't have any feeds or no feeds for this filter",
            "fetchingFeeds": "Fetching more feeds for you...",
            "noMoreFeeds": "You have reached the end!! That's all we have",
            "feeds": {
                "parkedSuccess": "You have successfully parked the news item"
            }
        },
        "parkPage": {
            "noFeeds": "You don't have any parked items",
            "feeds": {
                "unParkedSuccess": "You have successfully unparked the news item",
                "deletedFeedConfirm": "This feed item will be permanently deleted. Do you want to continue?",
                "feedDeletionSuccess": "You have successfully deleted the news item"
            }
        },
        "headerStrings": {
            "surfTab": {
                "Name": "Surf"
            },
            "parkTab": {
                "Name": "Park"
            },
            "configTab": {
                "Name": "Configure"
            },
            "logoutButton": {
                "Name": "Logout"
            }
        }
    }
};
