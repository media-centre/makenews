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
                "categoryDeletionConfirm": "This category will be deleted  and you will no longer receive feeds from its URLs. Parked items will remain unaffected. Are you sure you want to continue?",
                "deleteURLConfirm": "You will no longer receive feeds from this URL. Parked items will remain unaffected. Are you sure you want to continue?",
                "hintMessages": {
                    "RSSExampleURL": "Example: http://www.thehindu.com/opinion/?service=rss",
                    "TwitterExampleURL": "Example: @martinfowler, #savetheinternet",
                    "FacebookExampleURL": "Example: https://www.facebook.com/barackobama"
                },
                "successMessages": {
                    "categoryDeleteSuccess": "is successfully deleted",
                    "categoryUpdated": "is updated",
                    "urlDeleteSuccess": "Feed URL successfully deleted",
                    "urlSuccess": "URL is successfully added"
                },
                "errorMessages": {
                    "invalidUrlFormat": " Invalid URL format",
                    "emptyUrl": "URL should not be empty",
                    "validatingUrl": "validating Url...",
                    "alreadyAdded": "URL is already added",
                    "noSuchUrl": "No such link found",
                    "invalidRssUrl": "Invalid feed url",
                    "invalidTwitterUrl": "Invalid twitter url",
                    "invalidFacebookUrl": "Invalid facebook url",
                    "noFbAccess": "No such link or no access to the profile",
                    "urlDeleteFailed": "Url deletion failed"
                }
            },
            "configureTabName": "Configure"
        },
        "surfPage": {
            "noFeeds": "No feeds available",
            "fetchingFeeds": "Fetching feeds...",
            "noMoreFeeds": "No more feeds to display",
            "feeds": {
                "parkedSuccess": "Successfully parked the news item"
            }
        },
        "parkPage": {
            "noFeeds": "No feeds available",
            "feeds": {
                "unParkedSuccess": "Successfully unparked the news item",
                "deletedFeedConfirm": "This feed item will be deleted from the surf. Do you want to continue?",
                "feedDeletionSuccess": "Successfully deleted the news item"
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
