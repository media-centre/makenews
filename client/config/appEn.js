/*eslint no-multi-str:0*/
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
                "text": "MakeNews is for journalists and newsrooms. It helps you track news from web and social media in real-time."
            },
            "featuresHelp": {
                "configureHelp": {
                    "name": "Configure",
                    "text": "You identify your favourite RSS feeds, Twitter handles, Twitter hashtags and Facebook pages as sources. Group your sources into Categories and get a structured view of news updates."
                },
                "surfHelp": {
                    "name": "Surf",
                    "text": "MakeNews relays updates from sources. You do not have to go to every source to seek updates. Add sources in Configure then scroll infinitely through updates in Surf. Click on the item and it opens up in a new tab."
                },
                "parkHelp": {
                    "name": "Park",
                    "text": "Set aside interesting posts from the rush of news items in Surf. Parked items can be considered later or unparked and moved back to Surf."
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
                "addRSSUrlLinkLabel": "Add RSS feed URL",
                "addFacebookUrlLinkLabel": "Add Facebook public page URL",
                "addTwitterUrlLinkLabel": "Add Twitter Handle / Hash tag",
                "categoryDeletionConfirm": "will be deleted and you will no longer receive feeds from its URLs. Parked items will remain unaffected. Are you sure you want to continue?",
                "deleteURLConfirm": "You will no longer receive feeds from this URL. Parked items will remain unaffected. Are you sure you want to continue?",
                "hintMessages": {
                    "RSSHintMessage": "Please Enter RSS URL Here",
                    "FacebookHintMessage": "Please Enter Facebook URL Here",
                    "TwitterHintMessage": "Please Enter Twitter Handle Here",
                    "categoryTitle": "Invalid category name. Use only space or - or _"
                },
                "exampleMessages": {
                    "RSSExampleURL": "Example: http://www.thehindu.com/opinion/?service=rss",
                    "TwitterExampleURL": "Example: @the_hindu or #standwithjnu",
                    "FacebookExampleURL": "Example: https://www.facebook.com/thehindu"
                },
                "successMessages": {
                    "categoryDeleteSuccess": "is successfully deleted",
                    "categoryUpdated": "Category name is updated to",
                    "urlDeleteSuccess": "Feed URL successfully deleted",
                    "urlSuccess": "URL is successfully added"
                },
                "errorMessages": {
                    "emptyUrl": "URL cannot be empty",
                    "validatingUrl": "Validating the URL...",
                    "alreadyAdded": "URL is already added",
                    "invalidRssUrl": "Invalid RSS URL. Please check the URL",
                    "invalidTwitterUrl": "Invalid twitter handle or hashtag",
                    "noSuchTag": "No such hashtag or handle found",
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
            "fetchingFeeds": "Fetching parked feeds for you...",
            "feeds": {
                "unParkedSuccess": "You have successfully unparked the news item",
                "deletedFeedConfirm": "This feed item will be permanently deleted. Do you want to continue?",
                "feedDeletionSuccess": "You have successfully deleted the news item"
            }
        },
        "userProfile": {
            "passwordUpdateFailure": "Password update failed",
            "invalidCredentials": "Incorrect Current Password",
            "newPwdConfirmPwdMismatch": "New Password and Confirm Password do not match",
            "currentPassword": "current password",
            "newPassword": "new password",
            "confirmPassword": "confirm password",
            "newPwdShouldNotMatchCurrentPwd": "New Password should not be same as the Current Password",
            "pwdChangeSuccessful": "Password successfully changed",
            "pwdShouldNotBeEmpty": "Passwords cannot be left blank",
            "logoutConfirmMessage": "Your password has been successfully changed. The application will now logout. Please re-login with your new password"
        },
        "userProfileSettings": {
            "settings": "Settings",
            "profile": "Change Password",
            "logout": "Logout",
            "help": "Help"
        },
        "applicationTour": {
            "description": "Find HELP in the above options",
            "gotItText": "Got It"
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
        },
        "mainHeaderStrings": {
            "newsBoard": {
                "Name": "Scan News"
            },
            "storyBoard": {
                "Name": "Write a Story"
            },
            "configure": {
                "Name": "Configure"
            }
        }
    }
};
